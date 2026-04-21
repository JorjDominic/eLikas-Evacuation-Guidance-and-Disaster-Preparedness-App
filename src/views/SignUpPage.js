import React from 'react';
import '../styles/shared/sentinel.css';

function SignUpPage() {
	return (
		<section className="view-auth">
			<div className="auth-shell">
				<div className="auth-header">
					<h1>Create an eLikas Account</h1>
					<p>Join your barangay emergency network for faster advisories and safer evacuations.</p>
					<div className="auth-feature" style={{ margin: '0.75rem 0' }}>
						<h4>Why Register</h4>
						<p>Receive location-aware warnings, faster route recommendations, and center occupancy updates.</p>
					</div>
					<ul className="item-list">
						<li>Localized flood and weather alerts</li>
						<li>Nearby shelter availability tracking</li>
						<li>Preparedness checklists and route guides</li>
					</ul>
				</div>

				<form className="auth-card auth-form">
					<h2>Create Account</h2>
					<label>Full Name</label>
					<input type="text" placeholder="Juan Dela Cruz" />

					<label>Email</label>
					<input type="email" placeholder="juan@email.com" />

					<label>Password</label>
					<input type="password" placeholder="••••••••" />

					<label>Confirm Password</label>
					<input type="password" placeholder="••••••••" />

					<button type="button" className="auth-submit">Create Account</button>
				</form>
			</div>
		</section>
	);
}

export default SignUpPage;

