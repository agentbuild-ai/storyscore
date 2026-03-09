import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'StoryScore <support@agentbuild.ai>';

const SCENARIO_LABELS = {
  pitching_to_executives: 'Pitching to Executives',
  talking_to_manager:     'Talking to Your Manager',
  explaining_to_stakeholders: 'Explaining to Stakeholders',
};

function scoreColor(score) {
  if (score >= 85) return '#4ECCA3';
  if (score >= 55) return '#B197FC';
  return '#FF8FAB';
}

function metricRow(label, score, driver) {
  const color = scoreColor(score);
  const barWidth = Math.round(score);
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(177,151,252,0.10);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <span style="display:inline-block;background:${color}18;border:1px solid ${color}40;border-radius:6px;padding:2px 9px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${color};text-transform:uppercase;">${label}</span>
            </td>
            <td align="right">
              <span style="font-size:22px;font-weight:700;color:${color};">${score}</span>
              <span style="font-size:12px;color:#5A5680;margin-left:4px;">/100</span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:8px;">
              <div style="background:rgba(255,255,255,0.06);border-radius:999px;height:6px;overflow:hidden;">
                <div style="background:${color};width:${barWidth}%;height:6px;border-radius:999px;"></div>
              </div>
            </td>
          </tr>
          ${driver ? `
          <tr>
            <td colspan="2" style="padding-top:6px;">
              <span style="font-size:12px;color:#5A5680;line-height:1.5;">${driver}</span>
            </td>
          </tr>` : ''}
        </table>
      </td>
    </tr>`;
}

function coachingPointRow(point, index) {
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid rgba(177,151,252,0.08);">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#F0EEFF;">${index + 1}. ${point.headline}</p>
        <p style="margin:0;font-size:13px;color:#9B96C0;line-height:1.6;">${point.detail}</p>
        ${point.text_reference ? `
        <p style="margin:10px 0 0;padding-left:12px;border-left:2px solid #B197FC;font-size:12px;color:#5A5680;font-style:italic;">"${point.text_reference}"</p>
        ` : ''}
      </td>
    </tr>`;
}

function buildScorecardHtml(session) {
  const { scenario, scoring_response } = session;
  const pass1 = scoring_response.pass1;
  const pass2 = scoring_response.pass2;

  const scenarioLabel = SCENARIO_LABELS[scenario] || scenario;
  const overall = pass1.overall_score;
  const overallColor = scoreColor(overall);
  const overallLabel = pass1.overall_label || '';

  const impact  = pass1.metrics.impact_first;
  const flow    = pass1.metrics.narrative_coherence;
  const tone    = pass1.metrics.audience_adaptation;

  const coachingPoints = (pass2.coaching_points || []).slice(0, 3);
  const rewrite = pass2.rewrite_suggestion;
  const strength = pass2.strength_acknowledgment;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your StoryScore Scorecard</title>
</head>
<body style="margin:0;padding:0;background:#0E0A1E;font-family:'Helvetica Neue',Arial,sans-serif;color:#F0EEFF;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0A1E;">
    <tr>
      <td align="center" style="padding:40px 16px 60px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-0.02em;color:#B197FC;">StoryScore</p>
              <p style="margin:0;font-size:14px;color:#9B96C0;">Your Communication Scorecard</p>
            </td>
          </tr>

          <!-- Scenario badge -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="display:inline-block;background:rgba(177,151,252,0.12);border:1px solid rgba(177,151,252,0.30);border-radius:999px;padding:6px 18px;font-size:13px;font-weight:600;color:#B197FC;">${scenarioLabel}</span>
            </td>
          </tr>

          <!-- Overall score card -->
          <tr>
            <td style="background:#17133A;border:1px solid rgba(177,151,252,0.15);border-radius:16px;padding:28px 24px;text-align:center;margin-bottom:20px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5A5680;">Overall Score</p>
              <p style="margin:0;font-size:64px;font-weight:800;color:${overallColor};line-height:1;">${overall}</p>
              <p style="margin:10px 0 0;font-size:14px;color:${overallColor};font-weight:600;">${overallLabel}</p>
              ${strength ? `<p style="margin:16px 0 0;font-size:13px;color:#9B96C0;line-height:1.6;max-width:440px;margin-left:auto;margin-right:auto;">${strength}</p>` : ''}
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:20px;"></td></tr>

          <!-- Metric breakdown -->
          <tr>
            <td style="background:#17133A;border:1px solid rgba(177,151,252,0.15);border-radius:16px;padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5A5680;">Metric Breakdown</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${metricRow('Impact', impact.score, impact.primary_driver)}
                ${metricRow('Flow',   flow.score,   flow.primary_driver)}
                ${metricRow('Tone',   tone.score,   tone.primary_driver)}
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:20px;"></td></tr>

          <!-- Coaching points -->
          ${coachingPoints.length > 0 ? `
          <tr>
            <td style="background:#17133A;border:1px solid rgba(177,151,252,0.15);border-radius:16px;padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5A5680;">Coaching Notes</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${coachingPoints.map((p, i) => coachingPointRow(p, i)).join('')}
              </table>
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          ` : ''}

          <!-- Rewrite suggestion -->
          ${rewrite ? `
          <tr>
            <td style="background:#17133A;border:1px solid rgba(177,151,252,0.15);border-radius:16px;padding:20px 24px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5A5680;">Suggested Rewrite</p>
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#FF8FAB;text-transform:uppercase;letter-spacing:0.08em;">Original</p>
              <p style="margin:0 0 16px;padding:12px 16px;background:rgba(255,143,171,0.06);border-left:3px solid #FF8FAB;border-radius:0 8px 8px 0;font-size:13px;color:#9B96C0;line-height:1.6;font-style:italic;">${rewrite.original}</p>
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#4ECCA3;text-transform:uppercase;letter-spacing:0.08em;">Improved</p>
              <p style="margin:0 0 12px;padding:12px 16px;background:rgba(78,204,163,0.06);border-left:3px solid #4ECCA3;border-radius:0 8px 8px 0;font-size:13px;color:#F0EEFF;line-height:1.6;">${rewrite.improved}</p>
              ${rewrite.explanation ? `<p style="margin:0;font-size:12px;color:#5A5680;line-height:1.5;">${rewrite.explanation}</p>` : ''}
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          ` : ''}

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:8px;">
              <p style="margin:0;font-size:12px;color:#5A5680;line-height:1.7;">
                You're receiving this because you requested your scorecard at StoryScore.<br>
                <a href="mailto:support@agentbuild.ai" style="color:#B197FC;text-decoration:none;">support@agentbuild.ai</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send the scorecard email for a completed session.
 * @param {string} toEmail  - Recipient email
 * @param {object} session  - Full session row from Supabase
 */
export async function sendScorecard(toEmail, session) {
  const scenarioLabel = SCENARIO_LABELS[session.scenario] || session.scenario;
  const overall = session.scoring_response?.pass1?.overall_score ?? session.overall_score;

  const { error } = await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Your StoryScore: ${overall}/100 — ${scenarioLabel}`,
    html: buildScorecardHtml(session),
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}
