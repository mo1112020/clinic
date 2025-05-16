
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Check if already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Use the login function from AuthContext
    const success = login(username, password);
    
    if (success) {
      toast({
        title: t('loginSuccessful'),
        description: t('welcomeMessage'),
      });
      navigate('/');
    } else {
      toast({
        title: t('loginFailed'),
        description: t('invalidCredentials'),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/uploads/794ea767-dad6-4f2c-9607-84ace668de52.png" 
            alt="Canki-Klinik" 
            className="mx-auto w-48 h-48 mb-6 object-cover"
          />
          <h1 className="text-3xl font-bold text-canki">Canki-Klinik</h1>
          <p className="text-gray-600 mt-2">{t('veterinaryManagement')}</p>
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-canki">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t('signIn')}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('username')}
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('password')}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-canki hover:bg-canki/90"
                disabled={isLoading}
              >
                {isLoading ? t('signingIn') : t('signIn')}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>Canki-Klinik Management System</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
