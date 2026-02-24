import { z } from 'zod';
import { insertUserSchema, users, skills, insertSkillSchema, careers, predictions, roadmaps } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

const userSchema = z.custom<typeof users.$inferSelect>();
const skillSchema = z.custom<typeof skills.$inferSelect>();
const predictionSchema = z.custom<typeof predictions.$inferSelect>();
const careerSchema = z.custom<typeof careers.$inferSelect>();
const roadmapSchema = z.custom<typeof roadmaps.$inferSelect>();

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: userSchema,
        401: errorSchemas.unauthorized,
      }
    },
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: z.object({ username: z.string(), password: z.string(), name: z.string().optional() }),
      responses: {
        201: userSchema,
        400: errorSchemas.validation,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() })
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: userSchema,
        401: errorSchemas.unauthorized,
      }
    }
  },
  users: {
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/users/:id' as const,
      input: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        cgpa: z.number().optional(),
        interests: z.array(z.string()).optional(),
        goals: z.string().optional(),
      }),
      responses: {
        200: userSchema,
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    }
  },
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills' as const,
      responses: {
        200: z.array(skillSchema)
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/skills' as const,
      input: z.object({
        skillName: z.string(),
        skillLevel: z.string()
      }),
      responses: {
        201: skillSchema,
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/skills/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  predictions: {
    predict: {
      method: 'POST' as const,
      path: '/api/predict' as const,
      input: z.object({
        cgpa: z.number(),
        skills: z.array(z.string()),
        interests: z.array(z.string())
      }),
      responses: {
        200: z.object({
          prediction: predictionSchema,
          career: careerSchema,
          roadmap: roadmapSchema
        }),
        400: errorSchemas.validation,
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/predictions' as const,
      responses: {
        200: z.array(z.object({
          prediction: predictionSchema,
          career: careerSchema,
          roadmap: roadmapSchema
        }))
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
