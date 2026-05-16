/**
 * Chatbase Analytics Wrapper
 * Optional: Track Chatbase interactions for analytics
 */

interface ChatbaseAnalytics {
  chatOpenedAt: Date | null;
  messageCount: number;
  lessonId?: number;
  lessonTitle?: string;
}

class ChatbaseAnalyticsTracker {
  private analytics: ChatbaseAnalytics = {
    chatOpenedAt: null,
    messageCount: 0,
  };

  /**
   * Track when user opens Chatbase
   */
  trackChatOpened(lessonId?: number, lessonTitle?: string) {
    this.analytics.chatOpenedAt = new Date();
    this.analytics.lessonId = lessonId;
    this.analytics.lessonTitle = lessonTitle;

    console.log("📊 Chat opened for lesson:", lessonTitle);
  }

  /**
   * Track when user sends a message
   */
  trackMessage() {
    this.analytics.messageCount++;
    console.log("💬 Message count:", this.analytics.messageCount);
  }

  /**
   * Track when user closes Chatbase and get analytics
   */
  trackChatClosed() {
    if (!this.analytics.chatOpenedAt) return null;

    const timeSpentMs =
      new Date().getTime() - this.analytics.chatOpenedAt.getTime();
    const timeSpentMinutes = Math.round(timeSpentMs / 60000);

    const analyticsData = {
      ...this.analytics,
      timeSpentMinutes,
      timeSpentSeconds: Math.round(timeSpentMs / 1000),
      sessionEndedAt: new Date(),
    };

    console.log("📊 Chat session analytics:", analyticsData);

    // Reset for next session
    this.analytics = {
      chatOpenedAt: null,
      messageCount: 0,
    };

    return analyticsData;
  }

  /**
   * Send analytics to your backend
   */
  async sendAnalytics(analyticsData: any) {
    try {
      // Example: Send to your analytics backend
      // await fetch('/api/analytics/chatbase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analyticsData)
      // });

      console.log("✅ Analytics sent to backend:", analyticsData);
    } catch (error) {
      console.error("Error sending analytics:", error);
    }
  }

  /**
   * Get current session analytics
   */
  getSessionAnalytics() {
    return this.analytics;
  }
}

// Export singleton instance
export const chatbaseAnalytics = new ChatbaseAnalyticsTracker();
