export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface VoteRecord {
  id: string;
  pollId: string;
  optionId: string;
  votedAt: string;
  examMode?: 'kcet' | 'comedk' | 'all';
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  examMode: 'all' | 'kcet' | 'comedk';
  displayType?: 'widget' | 'popup' | 'both';
  totalVotes: number;
  voteHistory?: VoteRecord[];
}
