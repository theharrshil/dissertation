import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { cn, truncate } from "@/lib/utils";
import {
  Cog,
  House,
  Search,
  BookText,
  GitPullRequest,
  CreditCard,
  Plus,
  Image,
  CircleDot,
} from "lucide-react";
import { useAppSelector } from "@/hooks/use-store";

type LinkType = {
  path: string;
  label: string;
  icon: React.JSX.Element;
}[];

const top = (role: string): LinkType => {
  const common: LinkType = [
    {
      path: "/",
      label: "home",
      icon: <House className="h-4 w-4 mr-2" />,
    },
    {
      path: "/browse",
      label: "browse",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      path: "/reports",
      label: "reports",
      icon: <BookText className="h-4 w-4 mr-2" />,
    },
    {
      path: "/requests",
      label: "requests",
      icon: <GitPullRequest className="h-4 w-4 mr-2" />,
    },
    {
      path: "/invoices",
      label: "invoices",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      path: "/images/",
      label: "images",
      icon: <Image className="h-4 w-4 mr-2" />,
    },
  ];
  switch (role) {
    case "buyer":
      return common;
    case "developer":
      return [
        ...common,
        {
          path: "/choices",
          label: "choices",
          icon: <CircleDot className="h-4 w-4 mr-2" />,
        },
        {
          path: "/extras",
          label: "extras",
          icon: <Plus className="h-4 w-4 mr-2" />,
        },
      ];
    default:
      return common;
  }
};

const bottom = [
  {
    path: "/settings",
    label: "settings",
    icon: <Cog className="h-4 w-4 mr-2" />,
  },
];

const SideLink: React.FC<{ path: string; label: string; icon: React.JSX.Element }> = ({
  icon,
  label,
  path,
}) => {
  const { pathname } = useLocation();
  return (
    <Link
      to={path}
      key={path}
      className={cn("flex px-2 py-1.5 mb-1 duration-200 items-center hover:bg-gray-200 rounded", {
        "bg-gray-200 font-medium": pathname === path,
      })}
    >
      <span>{icon}</span>
      <p className="capitalize">{label}</p>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const name = useAppSelector((state) => state.auth.name);
  const role = useAppSelector((state) => state.auth.role);
  return (
    <div className="p-3 hidden sm:flex flex-col justify-between min-w-56 h-full bg-gray-50 border-r border-gray-300">
      <div>
        <div className="flex items-center justify-between">
          <Button variant="ghost">
            <img src="https://cal.com/avatar.svg" alt="user" className="h-5 w-5 mr-2" />
            <p className="ml-1 capitalize">{truncate(name, 14)}</p>
          </Button>
        </div>
        <div className="mt-4">
          {top(role).map((link) => (
            <SideLink {...link} key={link.path} />
          ))}
        </div>
      </div>
      <div>
        {bottom.map((link) => (
          <SideLink {...link} key={link.path} />
        ))}
      </div>
    </div>
  );
};
