import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('');
}

export const getBusinessName = (userId: string, users: User[]) => {
  return users.find(u => u.user_id === userId)?.business_name || 'Unknown';
}
