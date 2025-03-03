import { sub } from 'date-fns'
import { nanoid } from 'nanoid'
import type { Issue, User } from './types'

export const users: User[] = [
  {
    id: nanoid(),
    name: 'John Smith',
    picture: '/avatars/john-smith.png',
  },
  {
    id: nanoid(),
    name: 'Rose Eve',
    picture: '/avatars/rose-eve.png',
  },
  {
    id: nanoid(),
    name: 'Adam Young',
    picture: '/avatars/adam-young.png',
  },
  {
    id: nanoid(),
    name: 'Michael Scott',
    picture: '/avatars/michael-scott.png',
  },
]

export const issues: Issue[] = [
  {
    id: nanoid(),
    title: 'Implement user login',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    startDate: sub(new Date(), { days: 3 }),
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Fix payment processing',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Design database schema',
    status: 'done',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    startDate: sub(new Date(), { days: 7 }),
    endDate: sub(new Date(), { days: 2 }),
    estimatedHours: 10,
  },
  {
    id: nanoid(),
    title: 'Update API docs',
    status: 'backlog',
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Optimize frontend',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    startDate: sub(new Date(), { days: 2 }),
    estimatedHours: 12,
  },
  {
    id: nanoid(),
    title: 'Add unit tests',
    status: 'todo',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Implement dark mode',
    status: 'done',
    startDate: sub(new Date(), { days: 5 }),
    endDate: sub(new Date(), { hours: 12 }),
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Fix search filter',
    status: 'backlog',
    estimatedHours: 3,
  },
  {
    id: nanoid(),
    title: 'Refactor auth middleware',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Update user profiles',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    startDate: sub(new Date(), { days: 4 }),
    estimatedHours: 7,
  },
  {
    id: nanoid(),
    title: 'Add error logging',
    status: 'done',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    startDate: sub(new Date(), { days: 6 }),
    endDate: sub(new Date(), { days: 1 }),
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Improve form validation',
    status: 'backlog',
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Setup CI/CD pipeline',
    status: 'todo',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    estimatedHours: 10,
  },
  {
    id: nanoid(),
    title: 'Fix mobile layout',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    startDate: sub(new Date(), { days: 1 }),
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Add notifications',
    status: 'done',
    startDate: sub(new Date(), { days: 8 }),
    endDate: sub(new Date(), { days: 3 }),
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Optimize database queries',
    status: 'backlog',
    estimatedHours: 7,
  },
  {
    id: nanoid(),
    title: 'Update security headers',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    estimatedHours: 3,
  },
  {
    id: nanoid(),
    title: 'Implement caching',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    startDate: sub(new Date(), { days: 2 }),
    estimatedHours: 9,
  },
  {
    id: nanoid(),
    title: 'Fix login redirect',
    status: 'done',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    startDate: sub(new Date(), { days: 4 }),
    endDate: sub(new Date(), { hours: 6 }),
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Add analytics tracking',
    status: 'backlog',
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Update payment UI',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Refactor API routes',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    startDate: sub(new Date(), { days: 3 }),
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Fix image upload',
    status: 'done',
    startDate: sub(new Date(), { days: 6 }),
    endDate: sub(new Date(), { days: 2 }),
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Add password reset',
    status: 'backlog',
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Update dashboard',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    estimatedHours: 7,
  },
  {
    id: nanoid(),
    title: 'Optimize image loading',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    startDate: sub(new Date(), { days: 1 }),
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Fix email templates',
    status: 'done',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    startDate: sub(new Date(), { days: 5 }),
    endDate: sub(new Date(), { days: 1 }),
    estimatedHours: 3,
  },
  {
    id: nanoid(),
    title: 'Add user roles',
    status: 'backlog',
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Update checkout flow',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Fix navigation bar',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    startDate: sub(new Date(), { days: 2 }),
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Add loading states',
    status: 'done',
    startDate: sub(new Date(), { days: 7 }),
    endDate: sub(new Date(), { days: 3 }),
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Optimize API calls',
    status: 'backlog',
    estimatedHours: 7,
  },
  {
    id: nanoid(),
    title: 'Update signup form',
    status: 'todo',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Fix profile edit',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    startDate: sub(new Date(), { days: 1 }),
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Add data export',
    status: 'done',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    startDate: sub(new Date(), { days: 4 }),
    endDate: sub(new Date(), { hours: 12 }),
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Update footer links',
    status: 'backlog',
    estimatedHours: 3,
  },
  {
    id: nanoid(),
    title: 'Fix search results',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Add session timeout',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    startDate: sub(new Date(), { days: 3 }),
    estimatedHours: 7,
  },
  {
    id: nanoid(),
    title: 'Update terms page',
    status: 'done',
    startDate: sub(new Date(), { days: 6 }),
    endDate: sub(new Date(), { days: 2 }),
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Fix dropdown menu',
    status: 'backlog',
    estimatedHours: 3,
  },
  {
    id: nanoid(),
    title: 'Add input validation',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Optimize CSS',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    startDate: sub(new Date(), { days: 2 }),
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Fix logout bug',
    status: 'done',
    assignee: users.find((u) => u.name === 'Michael Scott')!.id,
    startDate: sub(new Date(), { days: 5 }),
    endDate: sub(new Date(), { days: 1 }),
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Add breadcrumbs',
    status: 'backlog',
    estimatedHours: 5,
  },
  {
    id: nanoid(),
    title: 'Update pricing page',
    status: 'todo',
    assignee: users.find((u) => u.name === 'John Smith')!.id,
    estimatedHours: 6,
  },
  {
    id: nanoid(),
    title: 'Fix table sorting',
    status: 'in-progress',
    assignee: users.find((u) => u.name === 'Rose Eve')!.id,
    startDate: sub(new Date(), { days: 1 }),
    estimatedHours: 4,
  },
  {
    id: nanoid(),
    title: 'Add file upload',
    status: 'done',
    startDate: sub(new Date(), { days: 7 }),
    endDate: sub(new Date(), { days: 3 }),
    estimatedHours: 7,
  },
  {
    id: nanoid(),
    title: 'Optimize JS bundle',
    status: 'backlog',
    estimatedHours: 8,
  },
  {
    id: nanoid(),
    title: 'Update contact form',
    status: 'todo',
    assignee: users.find((u) => u.name === 'Adam Young')!.id,
    estimatedHours: 5,
  },
]
