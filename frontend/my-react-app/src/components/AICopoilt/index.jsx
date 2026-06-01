import React from 'react'
import './index.css'

const AICopilot = ({
  email,
  onTriggerAction,
  activeDraftText,
  onChangeDraft,
  onGenerateDraft,
}) => {
  if (!email) {
    return (
      <aside className="ai-copilot-pane">
        <div className="ai-card ai-empty-card">
          <span className="ai-empty-icon">✨</span>
          <span className="ai-empty-label">AI Copilot</span>
          <p className="ai-empty-text">
            Select an email to active real-time AI summaries, recommendations,
            and draft generation.
          </p>
        </div>
      </aside>
    )
  }

  const handleDraftClick = () => {
    if (email.draftReply) {
      onGenerateDraft(email.id, email.draftReply)
    }
  }

  return (
    <aside className="ai-copilot-pane">
      {/* Card 1: AI Executive Summary */}
      <div className="ai-card">
        <div className="ai-card-title">AI Executive Summary</div>
        <div className="ai-summary-text">{email.executiveSummary}</div>
      </div>

      {/* Card 2: Recommended AI Actions */}
      <div className="ai-card">
        <div className="ai-card-title">Recommended AI Actions</div>
        <div className="ai-actions-list">
          {email.suggestedActions && email.suggestedActions.length > 0 ? (
            email.suggestedActions.map((action, idx) => (
              <button
                key={idx}
                className="ai-action-btn"
                onClick={() => onTriggerAction(action.text)}
              >
                <span>{action.emoji}</span>
                <span>{action.text}</span>
              </button>
            ))
          ) : (
            <p className="ai-no-actions">No immediate automated actions.</p>
          )}
        </div>
      </div>

      {/* Card 3: Suggested Draft Reply */}
      <div className="ai-card draft-card">
        <div className="draft-header-row">
          <div className="ai-card-title draft-header-title">
            Suggested Draft Reply
          </div>
          {email.draftReply &&
            email.draftReply !== '[DRAFT DISABLED FOR SPAM SENDER]' && (
              <button
                className="ai-draft-btn"
                onClick={handleDraftClick}
                title="Initialize AI reply"
              >
                <span>✨</span>
                <span>Draft Reply</span>
              </button>
            )}
        </div>

        <div className="ai-draft-textarea-wrapper">
          <textarea
            className="ai-draft-textarea"
            placeholder="Click 'Draft Reply' above to initialize AI email completion or type custom reply here..."
            value={activeDraftText || ''}
            onChange={e => onChangeDraft(email.id, e.target.value)}
          />
        </div>
      </div>
    </aside>
  )
}

export default AICopilot
