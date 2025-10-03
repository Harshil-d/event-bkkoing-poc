import { Form, useActionData, useNavigation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from '@mui/joy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { ISignUpResponse } from '../../dtos/auth.dto';
import { constants } from '../../constants/index.constants';

interface ISignUpFormProps {
  onSignUpResponse: (response: ISignUpResponse) => void;
}

const SignUpForm: React.FC<ISignUpFormProps> = ({ onSignUpResponse }) => {
  const actionData = useActionData() as ISignUpResponse;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (actionData) {
      onSignUpResponse(actionData);
    }
  }, [actionData, onSignUpResponse]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string;

    const errors: { [key: string]: string } = {};

    // Email validation
    if (!email || email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Full name validation
    if (!fullName || fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Password validation
    if (!password || password === '') {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword || confirmPassword === '') {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl error={!!formErrors.fullName}>
          <FormLabel>Full Name</FormLabel>
          <Input
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            error={!!formErrors.fullName}
          />
          {formErrors.fullName && (
            <Typography level="body-xs" color="danger">
              {formErrors.fullName}
            </Typography>
          )}
        </FormControl>

        <FormControl error={!!formErrors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            error={!!formErrors.email}
          />
          {formErrors.email && (
            <Typography level="body-xs" color="danger">
              {formErrors.email}
            </Typography>
          )}
        </FormControl>

        <FormControl error={!!formErrors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={!!formErrors.password}
            endDecorator={
              <Button
                variant="plain"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                sx={{ minHeight: 'auto', p: 1 }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </Button>
            }
          />
          {formErrors.password && (
            <Typography level="body-xs" color="danger">
              {formErrors.password}
            </Typography>
          )}
        </FormControl>

        <FormControl error={!!formErrors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            error={!!formErrors.confirmPassword}
            endDecorator={
              <Button
                variant="plain"
                size="sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                sx={{ minHeight: 'auto', p: 1 }}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </Button>
            }
          />
          {formErrors.confirmPassword && (
            <Typography level="body-xs" color="danger">
              {formErrors.confirmPassword}
            </Typography>
          )}
        </FormControl>

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Typography level="body-sm" sx={{ textAlign: 'center', mt: 2 }}>
          Already have an account?{' '}
          <Link href="/sign-in" sx={{ fontWeight: 'lg' }}>
            Sign in
          </Link>
        </Typography>
      </Stack>
    </Form>
  );
};

export default SignUpForm;


