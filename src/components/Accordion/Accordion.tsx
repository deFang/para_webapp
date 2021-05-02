import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

export default function SimpleAccordion() {
  const classes = useStyles();

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
              <Wrapper>
                  <PadDiv> Position </PadDiv>
                  <PadDiv> 0.5 </PadDiv>
              </Wrapper>
              <Wrapper>
                  <PadDiv> Side </PadDiv>
                  <PadDiv> Long </PadDiv>
              </Wrapper>
              <Wrapper>
                  <PadDiv> Entry Value </PadDiv>
                  <PadDiv> 53000 </PadDiv>
              </Wrapper>
              <Wrapper>
                  <PadDiv> Current Value </PadDiv>
                  <PadDiv> 55000 </PadDiv>
              </Wrapper>
              <Wrapper>
                  <PadDiv> PNL </PadDiv>
                  <PadDiv> 2000 </PadDiv>
              </Wrapper>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const PadDiv = styled.div`
    padding: 5px 20px 5px;
`;