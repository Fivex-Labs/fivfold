"use client";

import {
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiTypeorm,
  SiPrisma,
  SiFirebase,
  SiAuth0,
  SiPusher,
  SiMongodb,
  SiMariadb,
  SiSocketdotio,
  SiPostgresql,
  SiMysql,
  SiVite,
  SiNextdotjs,
} from 'react-icons/si';

import
{
  VscAzure
} from 'react-icons/vsc';

import
{
  DiMsqlServer
} from 'react-icons/di';

import {
  FaAws,
  FaKey
} from 'react-icons/fa6';

import {
  IoCloudDoneOutline
} from 'react-icons/io5';

import {
  TbCircleDashed,
  TbCircleNumber1,
  TbDatabase,
} from 'react-icons/tb';


import { cn } from "@/lib/utils";


const ICON_SIZE = 18;

const platformConfig: Record<
  string,
  {
    Icon: React.ComponentType<{ size?: number; color?: string; className?: string; style?: React.CSSProperties }>;
    color: string;
  }
> = {
  // Runtimes & frameworks
  node: { Icon: SiNodedotjs, color: "#339933" },
  express: { Icon: SiExpress, color: "#FFFFFF" },
  nestjs: { Icon: SiNestjs, color: "#E0234E" },
  vite: { Icon: SiVite, color: "#646CFF" },
  nextjs: { Icon: SiNextdotjs, color: "#FFFFFF" },

  // SQL ORMs
  typeorm: { Icon: SiTypeorm, color: "#FE0823" },
  prisma: { Icon: SiPrisma, color: "#2D3748" },
  
  // NoSQL ORMs / SDKs
  mongoose: { Icon: SiMongodb, color: "#880000" },
  "firebase-admin": { Icon: SiFirebase, color: "#FFCA28" },
  "cosmos-sdk": { Icon: VscAzure, color: "#0089D6" },
  "dynamodb-sdk": { Icon: FaAws, color: "#FF9900" },
  
  // Databases — SQL
  postgres: { Icon: SiPostgresql, color: "#336791" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  mssql: { Icon: DiMsqlServer, color: "#CC2927" },
  mariadb: { Icon: SiMariadb, color: "#003545" },

  // Databases — NoSQL
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  cosmosdb: { Icon: VscAzure, color: "#0089D6" },
  dynamodb: { Icon: FaAws, color: "#FF9900" },

  // Realtime providers
  socketio: { Icon: SiSocketdotio, color: "#010101" },

  // Auth & push providers
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  fcm: { Icon: SiFirebase, color: "#FFCA28" },
  auth0: { Icon: SiAuth0, color: "#EB5424" },
  cognito: { Icon: FaAws, color: "#FF9900" },
  jwt: { Icon: FaKey, color: "#8B5CF6" },
  onesignal: { Icon: TbCircleNumber1, color: "#FFFFFF" },
  sns: { Icon: FaAws, color: "#FF9900" },
  pushy: { Icon: IoCloudDoneOutline, color: "#fd6c6a" },
  "pusher-beams": { Icon: SiPusher, color: "#09b56c" },
};

export function PlatformIcon({
  platform,
  size = ICON_SIZE,
  className,
}: {
  platform: string;
  size?: number;
  className?: string;
}) {
  const config = platformConfig[platform] ?? { Icon: TbCircleDashed, color: "#94a3b8" };
  const { Icon, color } = config;

  const useStyleColor = ["cognito", "jwt", "onesignal", "sns", "pushy", "cosmos-sdk", "dynamodb-sdk", "cosmosdb", "dynamodb", "socketio", "mssql", "postgres", "mysql"].includes(platform);

  if (useStyleColor) {
    return (
      <Icon
        size={size}
        className={cn("shrink-0", className)}
        style={{ color }}
      />
    );
  }

  return (
    <Icon
      size={size}
      color={color}
      className={cn("shrink-0", className)}
    />
  );
}
