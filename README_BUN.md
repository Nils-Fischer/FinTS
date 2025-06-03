# fints - Modern Development Setup

This repository has been modernized to use Bun and modern TypeScript standards.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime and package manager)
- Node.js 18+ (for compatibility)

### Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Build the project:**
   ```bash
   bun run build
   ```

3. **Run tests:**
   ```bash
   bun run test
   ```

4. **Watch mode for development:**
   ```bash
   bun run dev
   ```

5. **Format code:**
   ```bash
   bun run format
   ```

### Configuration

- **TypeScript**: Single `tsconfig.json` with modern ES2022 target
- **Jest**: Configured for TypeScript with ts-jest
- **Prettier**: Code formatting with consistent style
- **Bun**: Package management and script running

### Scripts Available

- `prebuild` - Generate XSD types (runs automatically before build)
- `build` - Compile TypeScript
- `clean` - Remove build artifacts
- `docs` - Generate documentation
- `test` - Run unit tests (excluding acceptance tests)
- `test:acceptance` - Run acceptance tests
- `dev` - Build in watch mode
- `format` - Format code with Prettier

### Migration Notes

This repository has been modernized from the original setup:

- Moved from npm to Bun for faster package management
- Consolidated multiple TypeScript configs into one
- Updated to modern dependency versions
- Relaxed some strict TypeScript rules for gradual migration
- Fixed Jest configuration for compatibility

For production use, you may want to gradually re-enable stricter TypeScript rules in `tsconfig.json`. 