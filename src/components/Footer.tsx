import { version } from '../../package.json';

export const Footer = () => {
  return (
    <div className='cs1 ce12 grid'>
      <div className='cs1 ce4'>
        <button className='button-icon button-icon-small icon-settings' type='button'></button>
      </div>
      <div className='cs8 ce12' style={{ textAlign: 'right' }}>
        Version {version}
      </div>
    </div>
  );
};
