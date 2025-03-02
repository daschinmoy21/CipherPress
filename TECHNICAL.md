# CipherPress Technical Documentation

## Architecture Overview

CipherPress is built using React with TypeScript, leveraging Web3 technologies for decentralized content storage and user authentication.

### Tech Stack

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