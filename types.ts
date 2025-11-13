
import type React from 'react';

export interface Country {
  code: string;
  name: string;
  FlagComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  barColor: string;
}
