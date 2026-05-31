import { 
  UserProfile, 
  Post, 
  FriendRequest, 
  UserConnections, 
  Story, 
  DirectMessage, 
  GroupChat, 
  Notification, 
  Report, 
  ActivityLog, 
  AppSettings,
  ReactionType,
  PostComment
} from './types';

// Let's create an elegant initial dataset to populate the MSN Community Hub.
const INITIAL_PROFILES: UserProfile[] = [
  {
    uid: "admin_user",
    name: "Dr. Alonto Domocao",
    email: "ad_system@msumain.edu.ph",
    username: "@msu_admin",
    bio: "Chief System Administrator for ONEMSU. Forging peace and scholarly excellence throughout the Mindanao region.",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    coverURL: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
    campus: "MSU Main",
    courseAndYear: "Faculty of Social Sciences",
    role: "admin",
    isVerified: true,
    achievements: ["System Founder", "Peace Advocate"],
    privacySettings: { profileVisibility: "public", messagePermission: "everyone", activityLogPublic: true }
  },
  {
    uid: "user_marawi_1",
    name: "Sittie Fatima",
    email: "sittie.fatima@msumain.edu.ph",
    username: "@sittie_fatima",
    bio: "Empowered BS Computer Science Junior at MSU Marawi. Fascinated by AI, game design, and local Maranao craft weave. ✨",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    coverURL: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
    campus: "MSU Main",
    courseAndYear: "BS Computer Science - 3rd Year",
    role: "student",
    isVerified: true,
    achievements: ["Honor Student", "Code Queen 2026"],
    privacySettings: { profileVisibility: "public", messagePermission: "everyone", activityLogPublic: true }
  },
  {
    uid: "user_iit_1",
    name: "Kyle Christian",
    email: "kyle.christian@g.msuiit.edu.ph",
    username: "@kyle_tech",
    bio: "Robotics Major and Innovator at MSU-IIT. Playing drums, programming, and making dreams into reality.",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    coverURL: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    campus: "MSU IIT",
    courseAndYear: "BS Electronics Engineering - 4th Year",
    role: "student",
    isVerified: false,
    achievements: ["Robotics Champion"],
    privacySettings: { profileVisibility: "friends", messagePermission: "friends", activityLogPublic: true }
  },
  {
    uid: "user_gensan_1",
    name: "Datu Fahad",
    email: "fahad.datu@msugensan.edu.ph",
    username: "@fahad_datu",
    bio: "President of the Gensan Debating Society. Focused on international law, regional policy and tuna farming research.",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    coverURL: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    campus: "MSU Gensan",
    courseAndYear: "BA Political Science - 4th Year",
    role: "student",
    isVerified: true,
    achievements: ["Campus Leader", "Best Debater '25"],
    privacySettings: { profileVisibility: "public", messagePermission: "everyone", activityLogPublic: true }
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: "post_1",
    userId: "admin_user",
    userName: "Dr. Alonto Domocao",
    userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    userCampus: "MSU Main",
    userRole: "admin",
    isVerifiedUser: true,
    content: "Welcome, scholars, to ONEMSU! This digital gateway unites our 8 glorious campuses across Mindanao and Sulu. Connect with colleagues, explore academic libraries, share research and coordinate local activities. Together, we continue the legacy of peace and learning! #ONEMSU #MSULegacy",
    mediaUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    isPinned: true,
    hashtags: ["ONEMSU", "MSULegacy"],
    shares: 42,
    reactions: [
      { userId: "user_marawi_1", userName: "Sittie Fatima", type: "love" },
      { userId: "user_iit_1", userName: "Kyle Christian", type: "like" },
      { userId: "user_gensan_1", userName: "Datu Fahad", type: "wow" }
    ],
    comments: [
      {
        id: "comment_1_1",
        postId: "post_1",
        userId: "user_marawi_1",
        userName: "Sittie Fatima",
        userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content: "What a beautiful initiative! The student council of Marawi fully supports ONEMSU.",
        timestamp: Date.now() - 120000000
      }
    ],
    timestamp: Date.now() - 360000000
  },
  {
    id: "post_2",
    userId: "user_marawi_1",
    userName: "Sittie Fatima",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    userCampus: "MSU Main",
    userRole: "student",
    isVerifiedUser: true,
    content: "Just submitted my research blueprint for the Marawi Tech-Weave project! We are combining tribal designs with interactive LED textile displays. Any electronics wizards in MSU-IIT willing to collaborate? #TechWeave #MSUIIT #MSUMain",
    mediaUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800",
    hashtags: ["TechWeave", "MSUIIT", "MSUMain"],
    shares: 11,
    reactions: [
      { userId: "user_iit_1", userName: "Kyle Christian", type: "like" },
      { userId: "user_gensan_1", userName: "Datu Fahad", type: "love" }
    ],
    comments: [
      {
        id: "comment_2_1",
        postId: "post_2",
        userId: "user_iit_1",
        userName: "Kyle Christian",
        userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        content: "This sounds absolutely stellar, Sittie! Message me in the DM. I can help with the Arduino microcontrollers. @sittie_fatima",
        timestamp: Date.now() - 80000000
      }
    ],
    timestamp: Date.now() - 100000000
  }
];

const INITIAL_STORIES: Story[] = [
  {
    id: "story_1",
    userId: "user_marawi_1",
    userName: "Sittie Fatima",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
    timestamp: Date.now() - 10 * 60000,
    viewers: ["admin_user", "user_iit_1"],
    reactions: [{ userId: "user_iit_1", reaction: "❤️" }]
  },
  {
    id: "story_2",
    userId: "user_iit_1",
    userName: "Kyle Christian",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    imageUrl: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400",
    timestamp: Date.now() - 2 * 3600000,
    viewers: ["user_marawi_1"],
    reactions: [{ userId: "user_marawi_1", reaction: "🔥" }]
  }
];

const INITIAL_GROUPS: GroupChat[] = [
  {
    id: "group_1",
    name: "MSU Hackathon 2026",
    description: "Global team matching and project sharing workspace for student builders.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200",
    members: ["admin_user", "user_marawi_1", "user_iit_1", "user_gensan_1"],
    moderators: ["admin_user", "user_marawi_1"],
    messages: [
      {
        id: "gm_1",
        chatId: "group_1",
        senderId: "admin_user",
        senderName: "Dr. Alonto Domocao",
        text: "Good luck with team formations, builders! Make the Alonto legacy proud.",
        timestamp: Date.now() - 360000000,
        seen: true
      },
      {
        id: "gm_2",
        chatId: "group_1",
        senderId: "user_marawi_1",
        senderName: "Sittie Fatima",
        text: "Thanks Dr. Alonto! Looking for coders skilled in full-stack setups.",
        timestamp: Date.now() - 180000000,
        seen: true
      }
    ]
  }
];

class SocialDataStore {
  private keyPrefix = "onemsu_store_";

  private load<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(this.keyPrefix + key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.keyPrefix + key, JSON.stringify(value));
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  }

  // State caches
  public profiles: UserProfile[] = [];
  public posts: Post[] = [];
  public stories: Story[] = [];
  public friendRequests: FriendRequest[] = [];
  public connections: Record<string, UserConnections> = {}; // userId -> connections
  public directMessages: DirectMessage[] = [];
  public groups: GroupChat[] = [];
  public notifications: Notification[] = [];
  public reports: Report[] = [];
  public activityLogs: ActivityLog[] = [];
  public activeUser: UserProfile | null = null;
  public settings: AppSettings = {
    notificationsEnabled: true,
    emailAlerts: false,
    appearanceMode: "dark",
    primaryColor: "#f5d36b"
  };

  constructor() {
    this.initData();
  }

  private initData() {
    this.profiles = this.load("profiles", INITIAL_PROFILES);
    this.posts = this.load("posts", INITIAL_POSTS);
    this.stories = this.load("stories", INITIAL_STORIES);
    this.friendRequests = this.load("friend_requests", [
      {
        id: "req_1",
        senderId: "user_gensan_1",
        senderName: "Datu Fahad",
        senderCampus: "MSU Gensan",
        senderPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        receiverId: "user_marawi_1",
        timestamp: Date.now() - 50 * 60000,
        status: "pending"
      }
    ]);
    
    // Connections Mapping
    const defaultConnections: Record<string, UserConnections> = {
      admin_user: { friends: ["user_marawi_1"], following: ["user_marawi_1"], followers: [], blocked: [] },
      user_marawi_1: { friends: ["admin_user"], following: ["admin_user"], followers: ["admin_user"], blocked: [] },
      user_iit_1: { friends: [], following: ["user_marawi_1"], followers: [], blocked: [] },
      user_gensan_1: { friends: [], following: [], followers: [], blocked: [] }
    };
    this.connections = this.load("connections", defaultConnections);

    // Messages
    this.directMessages = this.load("messages", [
      {
        id: "m_1",
        chatId: "admin_user_user_marawi_1",
        senderId: "admin_user",
        senderName: "Dr. Alonto Domocao",
        text: "Please send the student council agenda for next week's campus board meeting.",
        timestamp: Date.now() - 72000000,
        seen: true
      },
      {
        id: "m_2",
        chatId: "admin_user_user_marawi_1",
        senderId: "user_marawi_1",
        senderName: "Sittie Fatima",
        text: "Got it Dr. Alonto! Designing a comprehensive summary right now.",
        timestamp: Date.now() - 36000000,
        seen: false
      }
    ]);

    this.groups = this.load("groups", INITIAL_GROUPS);
    
    this.notifications = this.load("notifications", [
      {
        id: "notif_1",
        receiverId: "user_marawi_1",
        senderId: "user_gensan_1",
        senderName: "Datu Fahad",
        senderPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        type: "friend_request",
        title: "Friend Request",
        body: "Datu Fahad from MSU Gensan sent you a friend request.",
        targetId: "req_1",
        seen: false,
        timestamp: Date.now() - 50 * 60000
      }
    ]);

    this.reports = this.load("reports", [
      {
        id: "rep_1",
        reporterId: "user_iit_1",
        reporterName: "Kyle Christian",
        contentType: "post",
        contentId: "post_2",
        reportedId: "user_marawi_1",
        details: "False research information claim.",
        status: "pending",
        timestamp: Date.now() - 1000 * 3600
      }
    ]);

    this.activityLogs = this.load("activity_logs", [
      {
        id: "act_1",
        userId: "user_marawi_1",
        actionType: "login",
        description: "Authenticated successfully from Marawi network.",
        timestamp: Date.now() - 3600000
      },
      {
        id: "act_2",
        userId: "user_marawi_1",
        actionType: "post",
        description: "Published a post on Tech-Weave design project.",
        timestamp: Date.now() - 2400000
      }
    ]);

    this.settings = this.load("settings", {
      notificationsEnabled: true,
      emailAlerts: false,
      appearanceMode: "dark",
      primaryColor: "#f5d36b"
    });

    // Default active user is Dr. Alonto (for super admin visibility out of the box)
    this.activeUser = this.profiles[1]; // sittie fatima is a great test student!
  }

  public syncAll() {
    this.save("profiles", this.profiles);
    this.save("posts", this.posts);
    this.save("stories", this.stories);
    this.save("friend_requests", this.friendRequests);
    this.save("connections", this.connections);
    this.save("messages", this.directMessages);
    this.save("groups", this.groups);
    this.save("notifications", this.notifications);
    this.save("reports", this.reports);
    this.save("activity_logs", this.activityLogs);
    this.save("settings", this.settings);
  }

  // Helper: append activity logger
  public addLog(userId: string, actionType: ActivityLog['actionType'], description: string) {
    const freshLog: ActivityLog = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random()*1000),
      userId,
      actionType,
      description,
      timestamp: Date.now()
    };
    this.activityLogs.unshift(freshLog);
    this.syncAll();
  }

  // --- Auth API ---
  public loginWithEmail(email: string): UserProfile {
    // If user already exists, pick it
    let user = this.profiles.find(pro => pro.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Create profile automatically for ease of testing
      const baseName = email.split('@')[0];
      user = {
        uid: "user_" + Date.now(),
        name: baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/[^a-zA-Z]/g, ' '),
        email: email,
        username: "@" + baseName.replace(/[^a-zA-Z0-9_]/g, ''),
        campus: "MSU Main",
        role: "student",
        isVerified: false,
        achievements: ["Novice Academic"],
        privacySettings: { profileVisibility: "public", messagePermission: "everyone", activityLogPublic: true }
      };
      this.profiles.push(user);
    }
    this.activeUser = user;
    this.addLog(user.uid, "login", `User logged in using traditional email portal.`);
    this.syncAll();
    return user;
  }

  public registerUser(name: string, email: string): UserProfile {
    const baseUsername = "@" + email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    const newUser: UserProfile = {
      uid: "user_" + Date.now(),
      name,
      email,
      username: baseUsername,
      campus: "MSU Main",
      role: "student",
      isVerified: false,
      achievements: ["Self Registered"],
      privacySettings: { profileVisibility: "public", messagePermission: "everyone", activityLogPublic: true }
    };
    this.profiles.push(newUser);
    this.activeUser = newUser;
    this.addLog(newUser.uid, "profile_update", `Registered account and initialised profile space.`);
    this.syncAll();
    return newUser;
  }

  // --- Profile System ---
  public updateProfile(uid: string, fields: Partial<UserProfile>) {
    this.profiles = this.profiles.map(pro => {
      if (pro.uid === uid) {
        const updated = { ...pro, ...fields };
        if (this.activeUser?.uid === uid) {
          this.activeUser = updated;
        }
        return updated;
      }
      return pro;
    });
    this.addLog(uid, "profile_update", `Modified specific fields of personal student card: ${Object.keys(fields).join(', ')}`);
    this.syncAll();
  }

  // --- Posts feed API ---
  public createPost(userId: string, content: string, mediaUrl?: string): Post {
    const author = this.profiles.find(p => p.uid === userId);
    const freshPost: Post = {
      id: "post_" + Date.now() + "_" + Math.floor(Math.random()*100),
      userId,
      userName: author?.name || "MSUan",
      userPhoto: author?.photoURL,
      userCampus: author?.campus || "MSU Main",
      userRole: author?.role || "student",
      isVerifiedUser: author?.isVerified || false,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : undefined,
      hashtags: content.match(/#\w+/g)?.map(tag => tag.replace('#', '')) || [],
      shares: 0,
      reactions: [],
      comments: [],
      timestamp: Date.now()
    };
    this.posts.unshift(freshPost);
    this.addLog(userId, "post", `Published a post containing: "${content.substring(0, 30)}..."`);
    this.updateTrendingTags();
    this.syncAll();
    return freshPost;
  }

  public deletePost(postId: string, userId: string) {
    this.posts = this.posts.filter(p => p.id !== postId);
    this.addLog(userId, "post", `Deleted post with ID: ${postId}`);
    this.syncAll();
  }

  public editPost(postId: string, text: string, userId: string) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          content: text,
          hashtags: text.match(/#\w+/g)?.map(tag => tag.replace('#', '')) || [],
        };
      }
      return p;
    });
    this.addLog(userId, "post", `Edited the text body of post: ${postId}`);
    this.syncAll();
  }

  // Pinned Posts
  public togglePinPost(postId: string, userId: string) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, isPinned: !p.isPinned };
      }
      return p;
    });
    this.addLog(userId, "post", `Toggled pin state of post: ${postId}`);
    this.syncAll();
  }

  // --- Reaction Engine ---
  public toggleReaction(postId: string, userId: string, reactionType: ReactionType) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const userObj = this.profiles.find(u => u.uid === userId);
    const existingIndex = post.reactions.findIndex(r => r.userId === userId);

    if (existingIndex !== -1) {
      if (post.reactions[existingIndex].type === reactionType) {
        // Double tap same type removes reaction
        post.reactions.splice(existingIndex, 1);
      } else {
        // Change type of reaction
        post.reactions[existingIndex].type = reactionType;
      }
    } else {
      // Add fresh reaction
      post.reactions.push({
        userId,
        userName: userObj?.name || "Member",
        type: reactionType
      });

      // Send Notification to recipient (if not reacting to self)
      if (post.userId !== userId) {
        this.sendNotification(
          post.userId,
          userId,
          "post_reaction",
          "Post Reacted",
          `reacted with ${reactionType.toUpperCase()} on your dashboard feed.`,
          postId
        );
      }
    }
    
    this.posts = [...this.posts];
    this.syncAll();
  }

  // --- Comment Engine ---
  public addComment(postId: string, userId: string, text: string): PostComment {
    const author = this.profiles.find(p => p.uid === userId);
    const freshComment: PostComment = {
      id: "comment_" + Date.now(),
      postId,
      userId,
      userName: author?.name || "MSU Scholar",
      userPhoto: author?.photoURL,
      content: text,
      timestamp: Date.now()
    };

    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const list = p.comments || [];
        // Extract mentions if any (e.g. @sittie_fatima)
        const mentions = text.match(/@\w+/g);
        if (mentions) {
          mentions.forEach(mention => {
            const mentionedUser = this.profiles.find(pro => pro.username.toLowerCase() === mention.toLowerCase());
            if (mentionedUser && mentionedUser.uid !== userId) {
              this.sendNotification(
                mentionedUser.uid,
                userId,
                "mention",
                "Mentioned You",
                `mentioned you in a comment post. "${text.substring(0, 30)}..."`,
                postId
              );
            }
          });
        }

        // Notify poster
        if (p.userId !== userId) {
          this.sendNotification(
            p.userId,
            userId,
            "comment",
            "New Comment",
            `commented: "${text.substring(0, 35)}"`,
            postId
          );
        }

        return { ...p, comments: [...list, freshComment] };
      }
      return p;
    });

    this.addLog(userId, "comment", `Commented on post: "${text.substring(0, 30)}..."`);
    this.syncAll();
    return freshComment;
  }

  public deleteComment(postId: string, commentId: string, userId: string) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
      }
      return p;
    });
    this.addLog(userId, "comment", `Deleted comment: ${commentId}`);
    this.syncAll();
  }

  // --- Friend and Follow System ---
  public sendFriendRequest(senderId: string, receiverId: string) {
    const sender = this.profiles.find(u => u.uid === senderId);
    if (!sender) return;

    // Check duplicate
    const duplicate = this.friendRequests.find(r => r.senderId === senderId && r.receiverId === receiverId);
    if (duplicate) return;

    const freshReq: FriendRequest = {
      id: "req_" + Date.now(),
      senderId,
      senderName: sender.name,
      senderPhoto: sender.photoURL,
      senderCampus: sender.campus,
      receiverId,
      timestamp: Date.now(),
      status: "pending"
    };

    this.friendRequests.unshift(freshReq);
    this.sendNotification(
      receiverId,
      senderId,
      "friend_request",
      "Friend Request",
      `sent you a friend request. Expand your campus circle!`,
      freshReq.id
    );

    this.syncAll();
  }

  public respondFriendRequest(reqId: string, action: "accepted" | "declined", currentUserId: string) {
    this.friendRequests = this.friendRequests.map(req => {
      if (req.id === reqId) {
        if (action === "accepted") {
          // Double link friends
          this.addFriend(req.senderId, req.receiverId);
          
          this.sendNotification(
            req.senderId,
            currentUserId,
            "accept_request",
            "Request Accepted",
            `accepted your friend request. Say hello in chat!`,
            currentUserId
          );
        }
        return { ...req, status: action };
      }
      return req;
    });
    
    // Auto remove notification related to this
    this.notifications = this.notifications.filter(notif => notif.targetId !== reqId);
    this.syncAll();
  }

  private addFriend(u1: string, u2: string) {
    this.ensureConnection(u1);
    this.ensureConnection(u2);
    
    if (!this.connections[u1].friends.includes(u2)) this.connections[u1].friends.push(u2);
    if (!this.connections[u2].friends.includes(u1)) this.connections[u2].friends.push(u1);

    // Auto follow each other
    this.followUser(u1, u2);
    this.followUser(u2, u1);

    this.addLog(u1, "friend_add", `Established custom academic linkage connection with ${u2}`);
    this.syncAll();
  }

  public unfriendUser(u1: string, u2: string) {
    this.ensureConnection(u1);
    this.ensureConnection(u2);

    this.connections[u1].friends = this.connections[u1].friends.filter(f => f !== u2);
    this.connections[u2].friends = this.connections[u2].friends.filter(f => f !== u1);
    this.syncAll();
  }

  public followUser(userId: string, targetId: string) {
    this.ensureConnection(userId);
    this.ensureConnection(targetId);

    if (!this.connections[userId].following.includes(targetId)) {
      this.connections[userId].following.push(targetId);
    }
    if (!this.connections[targetId].followers.includes(userId)) {
      this.connections[targetId].followers.push(userId);
    }
    this.syncAll();
  }

  public unfollowUser(userId: string, targetId: string) {
    this.ensureConnection(userId);
    this.ensureConnection(targetId);

    this.connections[userId].following = this.connections[userId].following.filter(u => u !== targetId);
    this.connections[targetId].followers = this.connections[targetId].followers.filter(u => u !== userId);
    this.syncAll();
  }

  private ensureConnection(userId: string) {
    if (!this.connections[userId]) {
      this.connections[userId] = { friends: [], following: [], followers: [], blocked: [] };
    }
  }

  // --- Stories System ---
  public uploadStory(userId: string, mediaUrl: string) {
    const author = this.profiles.find(pro => pro.uid === userId);
    const freshStory: Story = {
      id: "story_" + Date.now(),
      userId,
      userName: author?.name || "MSU Scholar",
      userPhoto: author?.photoURL,
      imageUrl: mediaUrl,
      timestamp: Date.now(),
      viewers: [],
      reactions: []
    };
    this.stories.unshift(freshStory);
    this.addLog(userId, "post", `Published active Story event timeline.`);
    this.syncAll();
  }

  public viewStory(storyId: string, viewerId: string) {
    this.stories = this.stories.map(sto => {
      if (sto.id === storyId && !sto.viewers.includes(viewerId)) {
        return { ...sto, viewers: [...sto.viewers, viewerId] };
      }
      return sto;
    });
    this.syncAll();
  }

  // Stories expire < 24Hrs
  public getActiveStories(): Story[] {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return this.stories.filter(story => story.timestamp > twentyFourHoursAgo);
  }

  // --- Messages System ---
  public getChatPairId(u1: string, u2: string): string {
    return [u1, u2].sort().join("_");
  }

  public sendDirectMessage(senderId: string, receiverId: string, text: string, mediaUrl?: string) {
    const sender = this.profiles.find(u => u.uid === senderId);
    const chatId = this.getChatPairId(senderId, receiverId);

    const freshMsg: DirectMessage = {
      id: "msg_" + Date.now(),
      chatId,
      senderId,
      senderName: sender?.name || "Student",
      text,
      mediaUrl,
      timestamp: Date.now(),
      seen: false
    };

    this.directMessages.push(freshMsg);
    
    // Notify receiver
    this.sendNotification(
      receiverId,
      senderId,
      "message",
      "New Chat Message",
      `sent: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`,
      senderId
    );

    this.syncAll();
  }

  public markMessagesAsRead(chatId: string, readerId: string) {
    this.directMessages = this.directMessages.map(msg => {
      if (msg.chatId === chatId && msg.senderId !== readerId) {
        return { ...msg, seen: true };
      }
      return msg;
    });
    this.syncAll();
  }

  // --- Group Chats & System ---
  public createGroup(name: string, description: string, image?: string, creatorId?: string) {
    const freshGroup: GroupChat = {
      id: "group_" + Date.now(),
      name,
      description,
      image: image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200",
      members: creatorId ? [creatorId] : [],
      moderators: creatorId ? [creatorId] : [],
      messages: []
    };
    this.groups.push(freshGroup);
    if(creatorId) {
      this.addLog(creatorId, "post", `Founded new campus student organization portal: ${name}`);
    }
    this.syncAll();
  }

  public joinGroup(groupId: string, userId: string) {
    this.groups = this.groups.map(g => {
      if (g.id === groupId && !g.members.includes(userId)) {
        return { ...g, members: [...g.members, userId] };
      }
      return g;
    });
    this.syncAll();
  }

  public postGroupMessage(groupId: string, senderId: string, text: string) {
    const sender = this.profiles.find(u => u.uid === senderId);
    const freshMsg: DirectMessage = {
      id: "gmsg_" + Date.now(),
      chatId: groupId,
      senderId,
      senderName: sender?.name || "Member",
      text,
      timestamp: Date.now(),
      seen: false
    };

    this.groups = this.groups.map(g => {
      if (g.id === groupId) {
        return { ...g, messages: [...g.messages, freshMsg] };
      }
      return g;
    });

    this.syncAll();
  }

  // --- Report and Moderation Systems ---
  public fileReport(reporterId: string, contentType: Report['contentType'], contentId: string, reportedId: string, details: string) {
    const reporter = this.profiles.find(p => p.uid === reporterId);
    const freshReport: Report = {
      id: "report_" + Date.now(),
      reporterId,
      reporterName: reporter?.name || "Anonymous",
      contentType,
      contentId,
      reportedId,
      details,
      status: "pending",
      timestamp: Date.now()
    };
    this.reports.unshift(freshReport);
    this.addLog(reporterId, "security_log", `Filed moderation flag report against entity item ${contentId}`);
    this.syncAll();
  }

  public resolveReport(reportId: string, action: "dismissed" | "resolved", adminId: string) {
    this.reports = this.reports.map(rep => {
      if (rep.id === reportId) {
        return { ...rep, status: action };
      }
      return rep;
    });
    this.addLog(adminId, "security_log", `Reviewed report flag ID ${reportId} with resolution: ${action}`);
    this.syncAll();
  }

  // --- Block Lists & Privacy ---
  public blockUser(blockerId: string, targetId: string) {
    this.ensureConnection(blockerId);
    if (!this.connections[blockerId].blocked.includes(targetId)) {
      this.connections[blockerId].blocked.push(targetId);
    }
    // Remove friendships
    this.unfriendUser(blockerId, targetId);
    this.addLog(blockerId, "security_log", `Restricted security accessibility for target UID ${targetId}`);
    this.syncAll();
  }

  public unblockUser(blockerId: string, targetId: string) {
    this.ensureConnection(blockerId);
    this.connections[blockerId].blocked = this.connections[blockerId].blocked.filter(b => b !== targetId);
    this.syncAll();
  }

  // --- Notification engine ---
  public sendNotification(receiverId: string, senderId: string, type: Notification['type'], title: string, body: string, targetId: string) {
    const sender = this.profiles.find(u => u.uid === senderId);
    const freshNotif: Notification = {
      id: "notif_" + Date.now() + "_" + Math.floor(Math.random()*100),
      receiverId,
      senderId,
      senderName: sender?.name || "MSU Peer",
      senderPhoto: sender?.photoURL,
      type,
      title,
      body,
      targetId,
      seen: false,
      timestamp: Date.now()
    };
    this.notifications.unshift(freshNotif);
    this.syncAll();
  }

  public markNotificationsRead(userId: string) {
    this.notifications = this.notifications.map(n => {
      if (n.receiverId === userId) {
        return { ...n, seen: true };
      }
      return n;
    });
    this.syncAll();
  }

  // --- Trending Stats ---
  public trendingTags: { tag: string; count: number }[] = [];

  public updateTrendingTags() {
    const counts: Record<string, number> = {
      "ONEMSU": 24,
      "MSULegacy": 18,
      "MarawiStrong": 12,
      "IITRobotics": 9,
      "CampusPeace": 8
    };

    this.posts.forEach(p => {
      p.hashtags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    this.trendingTags = Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 6);
  }
}

export const store = new SocialDataStore();
store.updateTrendingTags();
