'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login, isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(username, password);
      
      if (result.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="overflow-hidden shadow-2xl border-0">
          <CardHeader className="text-center pb-2 bg-gradient-to-br from-primary/5 to-secondary/5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 mx-auto shadow-xl"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
            <CardTitle className="text-3xl font-bold text-gradient mb-2">
              Admin Portal
            </CardTitle>
            <p className="text-muted-foreground">
              Secure access to handball league management
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="form-field">
                  <label htmlFor="username" className="form-label flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>Username</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-input"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password" className="form-label flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-input pr-12"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full h-12 text-lg font-semibold btn-glow"
                size="lg"
              >
                {!loading && <ArrowRight className="w-5 h-5 mr-2" />}
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-border/50"
            >
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs">
                    Demo Access
                  </Badge>
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Username:</span>
                    <code className="bg-muted/50 px-2 py-1 rounded font-mono text-foreground">admin</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Password:</span>
                    <code className="bg-muted/50 px-2 py-1 rounded font-mono text-foreground">admin</code>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Secured with enterprise-grade encryption</span>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm"
        />
      </motion.div>
    </div>
  );
}
