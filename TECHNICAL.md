# CipherPress Technical Documentation

## Architecture Overview

CipherPress combines blockchain indexing with IPFS storage and local caching, featuring a minimalist Hacker News-inspired UI.

### Core Components

1. **Smart Contract (CipherPress.sol)**
   - Stores article CIDs and metadata
   - Maps CIDs to authors
   - Maintains chronological article index

2. **IPFS Service (ipfs.ts)**
   - Uses Helia for IPFS integration
   - Handles content upload and retrieval
   - Implements local caching strategy

3. **Storage Service (storage.ts)**
   - Manages blockchain interactions
   - Handles CID indexing
   - Filters available content in development

4. **UI Components**
   - NewsFeed: Hacker News-style article listing
   - ArticleDetail: Full-screen article view
   - NewsSubmissionForm: Article creation
   - Navigation: View switching
   - ProfileDropdown: Wallet management

## Implementation Details

### UI Architecture

1. **News Feed Layout**:
   ```typescript
   <div className="article-item">
     <div className="article-index">{index + 1}.</div>
     <div className="article-content">
       <div className="article-title">{title}</div>
       <div className="article-meta">
         <span>{timestamp}</span>
         <span>by {author}</span>
         <span>{tags}</span>
       </div>
     </div>
   </div>
   ```

2. **Article Detail View**:
   ```typescript
   <div className="article-detail">
     <div className="article-header">
       <h1>{title}</h1>
       <div className="article-meta">...</div>
     </div>
     <div className="article-content">{content}</div>
   </div>
   ```

### Styling System

```css
:root {
  --bg-color: #0a0a0a;
  --text-primary: #00ff00;
  --text-secondary: #00cc00;
  --text-dim: #006600;
  --border-color: #1a1a1a;
}
```

### Local Caching Strategy

1. **Storage Pattern**:
   ```typescript
   localStorage.setItem(`ipfs-article-${cid}`, content)
   ```

2. **Retrieval Pattern**:
   ```typescript
   const cached = localStorage.getItem(`ipfs-article-${cidString}`)
   if (cached) return JSON.parse(cached)
   ```

### Navigation System

- React Router for article detail views
- Custom view state for feed/submit toggle
- MetaMask integration for wallet connection

## Production Considerations

### IPFS Configuration

1. **Node Setup**:
   - Configure proper IPFS node
   - Set up CORS headers
   - Implement content pinning

2. **Gateway Strategy**:
   - Multiple gateway fallbacks
   - Local node priority
   - Caching optimization

### Performance Optimizations

1. **Content Loading**:
   - Progressive article loading
   - Cached content priority
   - Lazy image loading

2. **State Management**:
   - Local storage caching
   - Optimistic updates
   - Error boundary implementation

## Future Improvements

1. **Content Features**:
   - Comment system
   - Article voting
   - User profiles

2. **UI Enhancements**:
   - Advanced search
   - Tag filtering
   - Sort options

3. **Technical Updates**:
   - Layer 2 integration
   - Content compression
   - Enhanced caching

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Web3**: MetaMask, IPFS (pending implementation)
- **State Management**: React Hooks

## Project Structure

```
src/
├── components/
│   ├── NewsSubmissionForm.tsx   # Article submission form
│   ├── NewsFeed.tsx            # Article listing component
│   ├── Navigation.tsx          # Navigation/routing component
│   ├── ProfileDropdown.tsx     # Wallet connection dropdown
│   └── WalletConnect.tsx       # MetaMask integration
├── types/
│   └── ethereum.d.ts           # TypeScript definitions for Web3
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## Component Documentation

### App.tsx
- Main application container
- Manages global state for:
  - Current view (feed/submit)
  - Wallet connection status
- Handles routing between views
- Implements header and footer

### NewsSubmissionForm.tsx
- Handles article submission
- Features:
  - Title and content input
  - Tag management
  - Form validation
  - Loading states
  - IPFS integration (pending)
```typescript
interface NewsSubmission {
  title: string;
  content: string;
  tags: string[];
}
```

### NewsFeed.tsx
- Displays published articles
- Features:
  - Article cards
  - Tag display
  - Author information
  - Timestamp formatting
```typescript
interface NewsArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
  author: string;
}
```

### ProfileDropdown.tsx
- Handles wallet connection
- Features:
  - MetaMask integration
  - Address display/copy
  - Connection status
```typescript
interface ProfileDropdownProps {
  account: string | null;
  onConnect: () => void;
}
```

## Styling System

The application uses a custom CSS system with CSS variables for theming:

```css
:root {
  --bg-color: #0a0a0a;
  --header-bg: #111111;
  --text-primary: #00ff00;
  --text-secondary: #00cc00;
  --text-dim: #006600;
  --border-color: #1a1a1a;
  --hover-color: rgba(0, 255, 0, 0.1);
}
```

### Theme Components
- Terminal-inspired design
- Consistent color scheme
- Responsive layouts
- Interactive elements

## Web3 Integration

### MetaMask Connection
```typescript
const handleConnect = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  }
};
```

### IPFS Integration (Pending)
- Content storage
- Content retrieval
- CID management

## State Management

The application uses React's built-in state management through hooks:

```typescript
// View state
const [currentView, setCurrentView] = useState<'feed' | 'submit'>('feed');

// Wallet state
const [account, setAccount] = useState<string | null>(null);

// Form state
const [formData, setFormData] = useState<NewsSubmission>({
  title: '',
  content: '',
  tags: [],
});
```

## Future Implementations

1. **IPFS Integration**
   - Content storage
   - Content retrieval
   - File handling

2. **Smart Contracts**
   - Content verification
   - Author attribution
   - Tipping system

3. **Enhanced Features**
   - Article comments
   - Content moderation
   - Search functionality
   - Tag filtering

## Performance Considerations

- Lazy loading for content
- Optimized rendering
- Efficient state updates
- Responsive image handling

## Security Considerations

1. **Web3 Security**
   - Secure wallet connections
   - Transaction signing
   - Address validation

2. **Content Security**
   - IPFS content verification
   - Hash validation
   - Content integrity checks

3. **User Privacy**
   - Minimal data collection
   - No personal information storage
   - Pseudonymous publishing

## Testing

To run tests:
```bash
npm run test
```

Test coverage includes:
- Component rendering
- User interactions
- Web3 connections
- Form submissions

## Deployment

Build for production:
```bash
npm run build
```

The build process:
1. Compiles TypeScript
2. Bundles assets
3. Optimizes for production
4. Generates static files

## Troubleshooting

Common issues and solutions:
1. MetaMask connection issues
2. Content submission errors
3. State management problems
4. Styling inconsistencies

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code standards
- PR process
- Testing requirements
- Documentation guidelines 