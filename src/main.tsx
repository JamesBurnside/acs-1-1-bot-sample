import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Center } from './Center';
import { FluentThemeProvider } from '@azure/communication-react';
import { CopilotStudioTheme } from './theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <FluentThemeProvider fluentTheme={CopilotStudioTheme}>
      <Center>
        <App />
      </Center>
    </FluentThemeProvider>
);
