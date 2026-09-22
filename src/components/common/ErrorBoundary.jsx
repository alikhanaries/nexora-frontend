import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box className="flex min-h-screen items-center justify-center p-6">
          <Alert severity="error" variant="outlined" className="max-w-md w-full">
            <Typography variant="subtitle1" gutterBottom>
              This page encountered an error
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please reload the application. If the problem continues, contact support.
            </Typography>
            <Button variant="contained" size="small" onClick={this.handleReload}>
              Reload
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
