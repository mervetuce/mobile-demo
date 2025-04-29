export interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  description: string;
  image: string;
}

export const internationalEvents: Event[] = [
  {
    id: '1',
    name: 'Dubai Expo',
    location: 'Dubai, UAE',
    date: 'Oct 1, 2023 - Mar 31, 2024',
    description: 'A global event bringing together countries from around the world to showcase innovations.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'
  },
  {
    id: '2',
    name: 'Tokyo Olympics',
    location: 'Tokyo, Japan',
    date: 'Jul 23 - Aug 8, 2024',
    description: 'The world\'s largest sporting event featuring athletes from around the globe.',
    image: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?w=800'
  },
  {
    id: '3',
    name: 'Paris Fashion Week',
    location: 'Paris, France',
    date: 'Sep 25 - Oct 3, 2023',
    description: 'One of the most influential fashion events in the world, held in the fashion capital.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
  },
  {
    id: '4',
    name: 'SXSW Festival',
    location: 'Austin, USA',
    date: 'Mar 8-16, 2024',
    description: 'A conglomeration of film, interactive media, music festivals and conferences.',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'
  }
];