import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';
import { homeDescription } from '@/lib/content';
export const metadata:Metadata={title:'Global Oleochemicals & Surfactant Manufacturer | KLK OLEO Surfactants',description:homeDescription,alternates:{canonical:'/surfactants'}};
export default function Page(){return <HomePage/>;}
