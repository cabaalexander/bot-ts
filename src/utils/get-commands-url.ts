import { Routes } from 'discord-api-types/v10';

export default function getCommandsUrl({
  applicationId,
  guildId,
  commandId,
}: {
  applicationId: string;
  guildId?: string;
  commandId?: string;
}) {
  if (guildId && commandId) {
    return Routes.applicationGuildCommand(applicationId, guildId, commandId);
  }

  if (guildId) {
    return Routes.applicationGuildCommands(applicationId || '', guildId);
  }

  if (commandId) {
    return Routes.applicationCommand(applicationId, commandId);
  }

  return Routes.applicationCommands(applicationId || '');
}
