import './index.css'

const Login = () => {
  return (
    <div className="login-page-container">
      {/* Left Panel */}
      <div className="brand-panel">
        <div className="brand-content">
          <h1 className="brand-heading">
            AI Onebox Email Assistant{' '}
            <svg
              viewBox="0 0 24 24"
              width="25"
              height="25"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </h1>

          <p className="brand-tagline">
            Own Your Inbound Automation Pipeline,
            <br />
            crafted for the modern you.
          </p>

          <ul className="brand-features">
            <li>Instant lead intent</li>
            <li>Hyper-personalized AI-generated response drafting</li>
            <li>Native sync for Slack, and Calendars</li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="form-panel">
        <div className="form-content">
          <h2 className="form-heading">Welcome back</h2>

          <p className="form-subheading">Sign in to your Onebox account</p>

          <form className="login-form">
            {/* Sample Error Box */}
            <div className="error-box">
              <span className="error-text">Invalid email or password</span>
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="email-input" className="input-label">
                EMAIL ADDRESS
              </label>

              <input
                id="email-input"
                type="text"
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="password-input" className="input-label">
                  PASSWORD
                </label>

                <button type="button" className="forgot-password-link">
                  Forgot password?
                </button>
              </div>

              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="Enter password"
              />
            </div>

            {/* Submit */}
            <button type="button" className="submit-btn">
              Sign In
            </button>

            {/* Sign Up */}
            <p className="signup-prompt">
              Don't have an enterprise account?{' '}
              <a href="#signup" className="signup-link">
                Start a 14-day free trial
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
