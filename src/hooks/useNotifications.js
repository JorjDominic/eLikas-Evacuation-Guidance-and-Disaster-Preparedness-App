import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

// Module-level singleton so multiple callers share one channel subscription
let _channel = null;
let _refCount = 0;

const LEVEL_CONFIG = {
	high:   { title: 'eLikas Alert',    fallback: 'A new high-severity alert has been issued.'       },
	medium: { title: 'eLikas Advisory', fallback: 'A new moderate-severity advisory has been issued.' },
	low:    { title: 'eLikas Notice',   fallback: 'A new low-severity notice has been issued.'        },
};

/**
 * Fire an OS notification AND dispatch an in-app CustomEvent so the
 * ToastContainer always shows something, even when the OS swallows the
 * browser notification (Focus Assist, permission quirks, etc.).
 * @param {string} title
 * @param {string} body
 * @param {'high'|'medium'|'low'|'info'} [level='info']
 */
export function fireNotification(title, body, level = 'info') {
	// In-app event — always fires regardless of OS permission
	window.dispatchEvent(new CustomEvent('elikas:notification', { detail: { title, body, level } }));

	// OS notification — only when granted, wrapped so failures don't break anything
	if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
	try {
		new Notification(title, { body, icon: '/favicon.ico' });
	} catch (err) {
		console.warn('[eLikas] Notification failed:', err.message);
	}
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const raw = atob(base64);
	const arr = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
	return arr;
}

/**
 * Subscribe this device to Web Push and persist the subscription to Supabase.
 * Safe to call multiple times — skips if the device is already subscribed.
 */
async function registerWebPushSubscription(userId) {
	const vapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
	if (!vapidKey || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
	try {
		const reg = await navigator.serviceWorker.ready;
		let sub = await reg.pushManager.getSubscription();
		if (!sub) {
			sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidKey),
			});
		}
		const json = sub.toJSON();
		const { error } = await supabase.from('push_subscriptions').upsert(
			[{ endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth, user_id: userId || null }],
			{ onConflict: 'endpoint' }
		);
		if (error) console.warn('[eLikas] Could not save push subscription:', error.message);
	} catch (err) {
		console.warn('[eLikas] Web Push subscription failed:', err.message);
	}
}

function ensureChannel() {
	if (_channel) return; // already subscribed
	_channel = supabase
		.channel('push-alerts')
		.on(
			'postgres_changes',
			{ event: 'INSERT', schema: 'public', table: 'alerts' },
			(payload) => {
				const alert = payload.new;
				const lvl = alert?.level;
				const cfg = LEVEL_CONFIG[lvl];
				if (!cfg) return; // ignore unknown levels
				fireNotification(cfg.title, alert.title || cfg.fallback, lvl);
			}
		)
		.subscribe();
}

function teardownChannel() {
	if (!_channel) return;
	supabase.removeChannel(_channel);
	_channel = null;
}

export function useNotifications() {
	const { currentUser } = useAuth();
	const [permission, setPermission] = useState(
		typeof Notification !== 'undefined' ? Notification.permission : 'denied'
	);

	const requestPermission = useCallback(async () => {
		if (typeof Notification === 'undefined') return;
		const result = await Notification.requestPermission();
		setPermission(result);
		if (result === 'granted') {
			// Subscribe this device to Web Push now that the user has allowed it
			await registerWebPushSubscription(currentUser?.id);
		}
	}, [currentUser?.id]);

	// If permission was already granted (e.g. returning user), ensure this
	// device is subscribed to Web Push without requiring the user to re-click.
	useEffect(() => {
		if (
			permission === 'granted' &&
			'serviceWorker' in navigator &&
			'PushManager' in window
		) {
			registerWebPushSubscription(currentUser?.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser?.id]);

	useEffect(() => {
		_refCount++;
		// Channel opens unconditionally — in-app toasts don't need OS permission
		ensureChannel();
		return () => {
			_refCount--;
			if (_refCount === 0) teardownChannel();
		};
	}, []);

	return { permission, requestPermission };
}
