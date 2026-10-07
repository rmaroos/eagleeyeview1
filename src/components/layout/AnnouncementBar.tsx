import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';

const messages = [
  { icon: Truck, text: 'Free delivery on eligible orders' },
  { icon: ShieldCheck, text: 'Secure payments • Genuine products • Easy returns' },
  { icon: RotateCcw, text: 'New arrivals are now available' },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const Icon = messages[index].icon;

  return (
    <div className="bg-ink-950 text-white h-10 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10" />
      <div className="relative flex items-center gap-2.5 text-sm">
        <Icon size={15} className="text-blue-400" />
        <span className="font-medium tracking-wide">{messages[index].text}</span>
      </div>
    </div>
  );
}
