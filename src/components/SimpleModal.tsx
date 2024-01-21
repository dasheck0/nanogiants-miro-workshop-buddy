import Modal from 'react-modal';
import { useNavigate } from 'react-router';
import { SimpleModalItem } from './SimpleModalItem';

export interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNewChat: () => void;
}

export interface SimpleModalItems {
  title: string;
  onClick: () => void;
  isDangerous?: boolean;
  hasBottomBorder?: boolean;
}

export const SimpleModal: React.FC<SimpleModalProps> = (props: SimpleModalProps) => {
  const navigate = useNavigate();

  const items: SimpleModalItems[] = [
    {
      title: 'Start new Chat',
      onClick: () => {
        props.onStartNewChat();
      },
    },
    // {
    //   title: 'Chat / Workshop history',
    //   onClick: () => {},
    // },
    {
      title: 'Settings',
      onClick: () => {
        props.onClose();
        navigate('/settings');
      },
      hasBottomBorder: true,
    },
    {
      title: 'Chatverlauf löschen',
      onClick: () => {
        props.onStartNewChat();
      },
      isDangerous: true,
    },
  ];

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      contentLabel='Example Modal'
      overlayClassName='modal-overlay'
      className='modal'>
      {items.map((item, index) => {
        return (
          <SimpleModalItem
            title={item.title}
            onClick={item.onClick}
            isDangerous={item.isDangerous}
            hasBottomBorder={item.hasBottomBorder}
          />
        );
      })}
    </Modal>
  );
};
