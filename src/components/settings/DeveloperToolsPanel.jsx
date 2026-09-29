import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useFoundationEcho, useFoundationPing } from '../../hooks/foundation/useFoundationMutations.js';
import { getUserFacingMessage } from '../../services/api/apiError.js';

export function DeveloperToolsPanel() {
  const [echoMessage, setEchoMessage] = useState('hello');
  const [lastPing, setLastPing] = useState('');
  const [lastEcho, setLastEcho] = useState('');
  const [error, setError] = useState('');

  const pingMutation = useFoundationPing();
  const echoMutation = useFoundationEcho();

  const handlePing = async () => {
    setError('');
    try {
      const result = await pingMutation.mutateAsync();
      setLastPing(result?.message ?? JSON.stringify(result));
    } catch (pingError) {
      setError(getUserFacingMessage(pingError));
    }
  };

  const handleEcho = async () => {
    setError('');
    const message = echoMessage.trim();
    if (!message) {
      setError('Echo message is required (1–256 characters).');
      return;
    }
    try {
      const result = await echoMutation.mutateAsync({ message });
      setLastEcho(result?.message ?? JSON.stringify(result));
    } catch (echoError) {
      setError(getUserFacingMessage(echoError));
    }
  };

  return (
    <Paper variant="outlined" className="p-4">
      <Typography variant="subtitle2" gutterBottom>
        API diagnostics
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        Exercises GET /foundation/ping and POST /foundation/echo against your configured API base URL.
      </Typography>
      {error ? (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      ) : null}
      <Box className="mb-3 flex flex-wrap items-center gap-2">
        <Button size="small" variant="outlined" onClick={handlePing} disabled={pingMutation.isPending}>
          Ping
        </Button>
        {lastPing ? (
          <Typography variant="body2" fontFamily="monospace">
            → {lastPing}
          </Typography>
        ) : null}
      </Box>
      <Box className="flex flex-wrap items-end gap-2">
        <TextField
          label="Echo message"
          size="small"
          value={echoMessage}
          onChange={(e) => setEchoMessage(e.target.value)}
          inputProps={{ maxLength: 256 }}
        />
        <Button size="small" variant="outlined" onClick={handleEcho} disabled={echoMutation.isPending}>
          Echo
        </Button>
        {lastEcho ? (
          <Typography variant="body2" fontFamily="monospace">
            → {lastEcho}
          </Typography>
        ) : null}
      </Box>
    </Paper>
  );
}
