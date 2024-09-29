// services/lineService.js

export function createReplyMessage(messageText) {
  return {
    type: "text",
    text: `You said: ${messageText}`,
  };
}
