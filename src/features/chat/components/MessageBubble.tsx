import { MonoValue } from '@/components/shared/MonoValue'
import { formatHourMinute } from '@/lib/format'
import type { Message } from '@/types/chat'

/** Message de l'utilisateur : bulle indigo alignée à droite. */
export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm text-white">
        {message.content}
      </p>
      <MonoValue className="text-[10px] text-ink-mute">{formatHourMinute(message.createdAt)}</MonoValue>
    </div>
  )
}
