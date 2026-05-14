// Custom throttler config

import { Throttle } from '@nestjs/throttler';

// Strict rate for auth, payments
export const StrictThrottle = () => {
  return Throttle({
    default: {
      ttl: 1000,
      limit: 3,
    },
  });
};

// Moderate rate for orders
export const ModerateThrottle = () => {
  return Throttle({
    default: {
      ttl: 1000,
      limit: 5,
    },
  });
};

// Relax rate for read operations
export const RelaxedThrottle = () => {
  return Throttle({
    default: {
      ttl: 1000,
      limit: 20,
    },
  });
};
