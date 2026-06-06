import React from 'react';

import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Settings,
  Wrench,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

type MenuItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
};

type MenuGroup = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    id: 'operations',
    label: 'Operaciones',
    icon: Wrench,
    items: [
      {
        path: '/operations/reception',
        label: 'Recepción Vehicular',
        icon: Car,
        primary: true,
      },
      {
        path: '/operations/workorders',
        label: 'Órdenes de Trabajo',
        icon: ClipboardList,
        primary: true,
      },
    ],
  },

  {
    id: 'management',
    label: 'Gestión',
    icon: Users,
    items: [
      {
        path: '/customers',
        label: 'Clientes',
        icon: Users,
      },

      {
        path: '/vehicles',
        label: 'Vehículos',
        icon: Car,
      },
    ],
  },

  {
    id: 'configuration',
    label: 'Configuración',
    icon: Settings,
    items: [
      {
        path: '/settings',
        label: 'Configuración',
        icon: Settings,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const navigate = useNavigate();

  const location = useLocation();

  const [isHovered, setIsHovered] =
    React.useState(false);

  const [expandedGroups, setExpandedGroups] =
    React.useState<Record<string, boolean>>({
      operations: true,
      management: false,
      configuration: false,
    });

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCollapsed(true);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isGroupActive = (group: MenuGroup) => {
    return group.items.some(item =>
      location.pathname.startsWith(item.path)
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;

    const isActive =
      location.pathname === item.path;

    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center px-4 py-2 text-left transition-all duration-200 hover:bg-primary-800 ${
          isActive
            ? 'bg-primary-700 text-accent-400'
            : 'text-gray-300'
        } ${item.primary ? 'font-medium' : ''}`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />

        <span className="ml-3 text-sm">
          {item.label}
        </span>
      </button>
    );
  };

  const renderMenuGroup = (
    group: MenuGroup
  ) => {
    const Icon = group.icon;

    const active = isGroupActive(group);

    const expanded =
      expandedGroups[group.id];

    return (
      <div key={group.id}>
        <button
          onClick={() => {
            if (collapsed && !isHovered) {
              const firstItem =
                group.items[0];

              if (firstItem) {
                navigate(firstItem.path);
              }

              return;
            }

            toggleGroup(group.id);
          }}
          className={`w-full flex items-center px-4 py-3 text-left hover:bg-primary-800 transition-all duration-200 ${
            active
              ? 'bg-accent-600 border-r-4 border-accent-400'
              : ''
          } ${
            collapsed && !isHovered
              ? 'justify-center'
              : 'justify-between'
          }`}
          title={
            collapsed && !isHovered
              ? group.label
              : ''
          }
        >
          <div className="flex items-center">
            <Icon className="w-5 h-5 flex-shrink-0" />

            {(!collapsed || isHovered) && (
              <span className="ml-3 font-medium">
                {group.label}
              </span>
            )}
          </div>

          {(!collapsed || isHovered) &&
            (expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}
        </button>

        {(!collapsed || isHovered) &&
          expanded && (
            <div className="ml-4 border-l border-primary-700">
              {group.items.map(
                renderMenuItem
              )}
            </div>
          )}
      </div>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-primary-900 text-white transition-all duration-300 z-30 flex flex-col shadow-xl ${
        collapsed && !isHovered
          ? 'w-16'
          : 'w-64'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-700">
        {(!collapsed || isHovered) ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            <h1 className="text-xl font-bold">
              GESTBOX
            </h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hidden mt-4 pb-4">
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center px-4 py-3 text-left hover:bg-primary-800 transition-all duration-200 ${
            location.pathname === '/'
              ? 'bg-accent-600 border-r-4 border-accent-400'
              : ''
          } ${
            collapsed && !isHovered
              ? 'justify-center'
              : ''
          }`}
          title={
            collapsed && !isHovered
              ? 'Dashboard'
              : ''
          }
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />

          {(!collapsed || isHovered) && (
            <span className="ml-3 font-medium">
              Dashboard
            </span>
          )}
        </button>

        {menuGroups.map(renderMenuGroup)}
      </nav>
    </aside>
  );
};

export default Sidebar;