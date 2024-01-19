import { ChatMessage } from '../dtos/chat.dto';

export interface ChatMessageItemProps {
  information: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = (props: ChatMessageItemProps) => {
  return (
    <div className='cs1 ce12 grid' style={{ marginBottom: 32 }}>
      <div className='cs1 ce2' style={{ alignSelf: 'flex-start' }}>
        <img className='avatar' src={props.information.icon} />
      </div>
      <div className='grid cs3 ce12' style={{ alignSelf: 'flex-start' }}>
        <div className='cs1 ce12'>
          <span className='text-bold'>{props.information.username}</span>
          <span className='text-small text-muted'>{props.information.timestamp}</span>
        </div>
        <div className='cs1 ce12'>{props.information.message}</div>
      </div>
    </div>
  );
};
