import { useNavigate } from 'react-router-dom';
import { version } from '../../package.json';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className='grid w100'>
      <div className='cs1 ce4'>
        <button className='button-icon button-icon-small icon-settings' type='button' onClick={() => navigate('/settings')}></button>
      </div>
      <div className='cs8 ce12' style={{ textAlign: 'right' }}>
        Version {version}
      </div>
    </div>
  );
};
