import type { Media } from './types';
import type { serviceTextFields, serviceRowFields } from './service-seed';

export type ServiceItem = { title:string; copy?:string; label?:string; image?:Media };
export type ServicePageData = Partial<Record<typeof serviceTextFields[number][0],string>> &
  Partial<Record<typeof serviceRowFields[number][0],ServiceItem[]|null>> & {
    title:string; route:string; heading:string; introduction:string; intro_image?:Media;
  };
