import { useState } from 'react';
import { IconButton, styled, useMediaQuery } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';

const Root = styled('div')(
  ({ mobile, landscape, theme }) => `
    width: ${mobile ? '140px' : '170px'};
    height: max-content;
    padding: ${mobile ? '5px' : '5px 0 5px 10px'};
    border-radius: 10px;
    position: fixed;
    top: ${
      mobile && landscape ? '10px':
      mobile ? '20%' : '10px'
    };
    left: ${
      mobile && landscape ? '10%':
      mobile && !landscape ? '3%' : '7%'
    };
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
      width: ${!mobile && '90%'};
      display: flex;
      flex-wrap: wrap;
      gap: ${!mobile && '10px'};
      margin: 0 auto 5px auto;
      h5 {
        font-size: ${mobile ? '14px' : '16px'};
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
  const isLandscape = useMediaQuery('(orientation: landscape)')

  return (
    <Root mobile={Number(isMobile)} landscape={Number(isLandscape)}>
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