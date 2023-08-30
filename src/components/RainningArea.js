import { useState } from 'react';
import { IconButton, styled } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';

const Root = styled('div')(
  ({ mobile, theme }) => `
    width: ${mobile ? '140px' : '180px'};
    height: max-content;
    padding: ${mobile ? '5px' : '5px 0 5px 15px'};
    border-radius: 10px;
    position: fixed;
    top: ${mobile ? '20%' : '10px'};
    left: ${mobile ? '3%' : '7%'};
    background: rgba(255, 255, 255, 0.4);
    transition: all 0.3s;
    section {
      padding-left: 15px;
      display: flex;
      align-items: center;
      h3 {
        font-size: 16px;
        color: ${theme.palette.menubar.font};
        margin: 0;
        margin-bottom: ${mobile && '10px'};
      }
    }
    div {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 5px;
      h5 {
        font-size: 14px;
        padding-left: ${!mobile ? '5px' : '15px'};
        margin: 0;
        color: ${theme.palette.menubar.font};
      }
    }
  `
);

function RainningArea({ list }) {

  const { isMobile } = useStore()
  const [expanded, setExpanded] = useState(false)

  return (
    <Root mobile={Number(isMobile)}>
      <section>
        <h3>目前降雨地區</h3>
        {!isMobile && (
          <IconButton onClick={() => setExpanded(prev => !prev)}>
            <ExpandMore />
          </IconButton>
        )}
      </section>
      {(isMobile || expanded) && (
        <div>
          {list.map((item, i) => <h5 key={i}>{item}</h5>)}
        </div>
      )}
    </Root>
  )
}



export default observer(RainningArea);