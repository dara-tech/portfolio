import { 
  HomeIcon, 
  FolderKanbanIcon, 
  MapIcon, 
  BookOpenIcon, 
  MessageSquareIcon, 
  ClapperboardIcon,
  LayoutDashboardIcon,
  RocketIcon,
  CompassIcon,
  GraduationCapIcon,
  VideoIcon,
  BarChartIcon
} from 'lucide-react';

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: HomeIcon, description: 'Return to the main page' },
  { path: '/projects', label: 'Projects', icon: RocketIcon, description: 'View ongoing projects' },
  { path: '/roadmap', label: 'Roadmap', icon: CompassIcon, description: 'Explore learning paths' },
  { path: '/lessons', label: 'Lessons', icon: GraduationCapIcon, description: 'Access educational content' },
  { path: '/chat', label: 'Chat', icon: MessageSquareIcon, description: 'Engage in discussions' },
  { path: '/videos', label: 'Videos', icon: VideoIcon, description: 'Watch tutorial videos' }
];

export const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: BarChartIcon, description: 'Overview of site metrics' },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanbanIcon, description: 'Manage project listings' },
  { path: '/admin/roadmap', label: 'Roadmap', icon: MapIcon, description: 'Edit learning pathways' },
  { path: '/admin/lessons', label: 'Lessons', icon: BookOpenIcon, description: 'Curate educational content' },
  { path: '/admin/videos', label: 'Videos', icon: ClapperboardIcon, description: 'Manage video tutorials' }
];
