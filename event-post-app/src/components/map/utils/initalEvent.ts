import { Event } from '@/types/event.type';
import { User } from '@/types/user.type';

const initalUser: User = {
  id: 9999,
  name: 'Sample User',
  email: 'zzz@ggg.com',
  description: 'This is a sample user description.',
  thumbnail_url: 'https://example.com/sample-user.jpg',
};

export const initialEvent: Event = {
  id: 9999,
  title: 'Sample Event',
  date: '2023-10-01',
  location: '中野サンプラザ',
  description: 'This is a sample event description.',
  image_url: 'https://example.com/sample-event.jpg',
  user: initalUser,
};
