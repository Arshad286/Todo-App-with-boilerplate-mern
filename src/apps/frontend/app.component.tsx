
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';

import { AccountProvider, AuthProvider } from './contexts';
import { Config } from './helpers';
import { AppRoutes } from './routes';
import InspectLet from './vendor/inspectlet';
import { CommentProvider } from './contexts/comment.provider';
import { SharedTaskProvider } from './contexts/shared-task.provider';



export default function App(): React.ReactElement {
  useEffect(() => {
    const inspectletKey = Config.getConfigValue('inspectletKey');

    if (inspectletKey) {
      InspectLet();
    }
  }, []);

  return (
    <AuthProvider>
      <AccountProvider>
        <CommentProvider>
          <SharedTaskProvider>
        <Toaster />
        <Router>
          <AppRoutes />
        </Router>
      </SharedTaskProvider>
        </CommentProvider>
      </AccountProvider>
    </AuthProvider>
  );
}
