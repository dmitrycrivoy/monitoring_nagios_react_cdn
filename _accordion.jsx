const {
    colors,
    CssBaseline,
    ThemeProvider,
    Typography,
    Container,
    createTheme,
    Box,
    SvgIcon,
    Link,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    styled,
    StyledEngineProvider,
} = MaterialUI;

// Тема
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: colors.red.A400,
        },
    },
});

// Иконка-стрелка
function ExpandMoreIcon() {
    return (
        <SvgIcon>
            <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
        </SvgIcon>
    );
}

const MuiAccordion = styled((props) => (
        <Accordion disableGutters elevation={0} square {...props} />
    )) ( ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
    },
}));

const MuiAccordionSummary = styled((props) => (
    <AccordionSummary expandIcon={<ExpandMoreIcon/>} {...props} />
    )) ( ({ theme }) => ({
        backgroundColor:
            theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
        '& .AccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .AccordionSummary-content': {
            // marginLeft: theme.spacing(1),
        },
}));

const MuiAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
}));

const MainTypography = styled((props) => (
    <Typography sx={{ width: '20%'}} {...props} />
    )) ( ({ theme }) => ({
}));

const MuiTypography = styled((props) => (
    <Typography sx={{ width: '20%', color: 'text.secondary' }} {...props} />
    )) ( ({ theme }) => ({
}));


function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>

        <MuiAccordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <MuiAccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
            <MainTypography>Server 1</MainTypography>
            <MuiTypography>
                ENABLE
            </MuiTypography>
            <MuiTypography>
                CPU
            </MuiTypography>
            <MuiTypography>
                RAM
            </MuiTypography>
            <MuiTypography>
                SSD
            </MuiTypography>
            </MuiAccordionSummary>
            <MuiAccordionDetails>
            <MuiTypography>
                Server Information
            </MuiTypography>
            </MuiAccordionDetails>
        </MuiAccordion>

        <MuiAccordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <MuiAccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <MainTypography>Server 2</MainTypography>
                <MuiTypography>
                    DISABLE
                </MuiTypography>
                <MuiTypography>
                    CPU
                </MuiTypography>
                <MuiTypography>
                    RAM
                </MuiTypography>
                <MuiTypography>
                    SSD
                </MuiTypography>
            </MuiAccordionSummary>
            <MuiAccordionDetails>
                <MuiTypography>
                    Server Information
                </MuiTypography>
            </MuiAccordionDetails>
        </MuiAccordion>

        <MuiAccordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <MuiAccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <MainTypography>Server 3</MainTypography>
                <MuiTypography>
                    ENABLE
                </MuiTypography>
                <MuiTypography>
                    CPU
                </MuiTypography>
                <MuiTypography>
                    RAM
                </MuiTypography>
                <MuiTypography>
                    SSD
                </MuiTypography>
            </MuiAccordionSummary>
            <MuiAccordionDetails>
                <MuiTypography>
                    Server Information
                </MuiTypography>
            </MuiAccordionDetails>
        </MuiAccordion>
      
    </div>
  );
}

export default CustomizedAccordions;