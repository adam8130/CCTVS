import styled from 'styled-components';

const Root = styled.div(
  ({ $activeTrigger, $active, $color }) => `
    color: ${$activeTrigger ? $active : $color};
    padding: 7px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  `
);
  
export const ButtonWrapper = ({
  icon,
  color = 'rgb(101, 101, 101)',
  activeTrigger,
  activeColor = 'rgb(30,155,255)',
  children,
  ...rest
}) => {
  return (
    <Root 
      $color={color}
      $activeTrigger={activeTrigger}
      $active={activeColor}
      {...rest}
    >
      {icon}
      {children}
    </Root>
  )
}