import { Resend } from "resend";
import { env } from "../../config/env.js";

type SendInvitationEmailParams = {
  to: string;
  workspaceName: string;
  invitedByName: string;
  acceptUrl: string;
  rejectUrl: string;
};

const createResendClient = () => {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(env.RESEND_API_KEY);
};

const resend = createResendClient();

const escapeHtml = (value: string) => {
  const amp = "&" + "amp;";
  const lt = "&" + "lt;";
  const gt = "&" + "gt;";
  const quot = "&" + "quot;";
  const apos = "&" + "#39;";

  return value
    .replaceAll("&", amp)
    .replaceAll("<", lt)
    .replaceAll(">", gt)
    .replaceAll(String.fromCharCode(34), quot)
    .replaceAll("'", apos);
};

const buildInvitationHtml = (params: SendInvitationEmailParams) => {
  const workspaceName = escapeHtml(params.workspaceName);
  const invitedByName = escapeHtml(params.invitedByName);
  const acceptUrl = escapeHtml(params.acceptUrl);
  const rejectUrl = escapeHtml(params.rejectUrl);

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>Bạn được mời tham gia workspace "${workspaceName}"</h2>
      <p>
        <strong>${invitedByName}</strong> đã mời bạn tham gia workspace <strong>${workspaceName}</strong> trên TLX Cloud.
      </p>
      <p>Bạn có thể chấp nhận hoặc từ chối lời mời bằng các nút bên dưới:</p>
      <p>
        <a href="${acceptUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;margin-right:8px;">Accept invitation</a>
        <a href="${rejectUrl}" style="display:inline-block;padding:10px 16px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px;">Reject invitation</a>
      </p>
      <p>Nếu bạn không mong đợi email này, bạn có thể bỏ qua nó.</p>
    </div>
  `;
};

export const mailService = {
  async sendInvitationEmail(params: SendInvitationEmailParams) {
    if (!resend) {
      return { skipped: true as const };
    }

    if (!env.MAIL_FROM) {
      throw new Error("MAIL_FROM is required to send emails");
    }

    const result = await resend.emails.send({
      from: env.MAIL_FROM,
      to: params.to,
      subject: `Invitation to join workspace ${params.workspaceName}`,
      html: buildInvitationHtml(params),
    });

    return {
      skipped: false as const,
      id: result.data?.id ?? null,
    };
  },
};
