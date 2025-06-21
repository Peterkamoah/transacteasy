import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { users as mockUsers } from './data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('');
}

export const getBusinessName = (userId: string) => {
  return mockUsers.find(u => u.user_id === userId)?.business_name || 'Unknown';
}
