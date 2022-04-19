// QUERY
function getNagiosServices() {
    return new Promise( (resolve) => {

    let query = "servicelist";
    let services = {};
    let promises = [];
    let success = function(data) {

        if( query == "servicelist") {
            for( let hostname in data.data[query]) {
                let host = data.data[query][hostname];
                services[hostname] = {};
                for( let x = 0; x < host.length; x++) {
                    services[hostname][x] = host[x];
                }
            }
        }

        if (!$.isEmptyObject(services)) {
            let parameters;

            for( let host in services) {
                for( let service_index in services[host]) {

                    parameters = {
                        query: "service",
                        hostname: host,
                        servicedescription: services[host][service_index],
                    }
                    
                    function doAjax() {
                        return $.get({
                            url: 'curl.php',
                            data: parameters,
                            dataType: 'json',
                            success: false,
                            error: false,
                        })
                    }

                    promises.push(doAjax());

                }
            }
            Promise.all(promises).then( (data) => {
                let servicesData = [];
                let service = {};
                console.log(data);
                data.map( (el) => {
                    service[el.data.service.description] = {};
                    service[el.data.service.description].description = el.data.service.description;
                    service[el.data.service.description].plugin_output = el.data.service.plugin_output;
                    service[el.data.service.description].status = el.data.service.status;
                    service[el.data.service.description].last_check = new Date(el.data.service.last_check).toLocaleString("ru-RU");
                    servicesData[el.data.service["host_name"]] = service;
                });
                resolve(servicesData);
            } );
        }	
    }

    let error = function(data, textError) {
        console.log(textError);
    }

    let parameters = Object();
    parameters.query = query;
    
    $.ajax({
        url: 'curl.php',
        data: parameters,
        dataType: 'json',
        success: success,
        error: error,
    });

    });
}

getNagiosServices().then( (data) => {renderUI(data)} );

function renderUI(servicesInfo) {
    if (!servicesInfo) {
        function CustomizedAccordions() {
            return (
                <h1>Нет данных</h1>
            );
        }
        ReactDOM.render(
            <StyledEngineProvider injectFirst>
                <CustomizedAccordions />
            </StyledEngineProvider>, 
            document.querySelector('#app')
        );
    }
    else {

        // REACT COMPONENT
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
        
        // Theme
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
        
        // More Icon
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
                    : '#D9EFF9',
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
            <Typography sx={{ width: '35%'}} {...props} />
            )) ( ({ theme }) => ({
        }));
        
        const MuiTypography = styled((props) => (
            <Typography sx={{ width: '20%', color: 'text.secondary' }} {...props} />
            )) ( ({ theme }) => ({
        }));
        
        const StringTypography = styled((props) => {
            let bgColor;
            switch (props.status) {
                // OK
                case 2:
                    break;
                // WARNING
                case 4:
                    bgColor = "#ffd993";
                    break;
                // CRITICAL
                case 16:
                    bgColor = "#ffabaf";
                    break;
                default:
                    break;
            }
            return (
                <Typography sx={{ color: 'text.secondary', backgroundColor: bgColor}} {...props} />
            )
        })( ({ theme }) => ({
        }));
        
        
        function CustomizedAccordions() {
        //   const [expanded, setExpanded] = React.useState('panel1');
        const [expanded, setExpanded] = React.useState(false);

        const handleChange = (panel) => (event, newExpanded) => {
            setExpanded(newExpanded ? panel : false);
        };

        // AccordionItems
        let servicesMain = [];
        let servicesDetails = [];
        let count = 1;

        for ( let host in servicesInfo) {
            servicesDetails = [];
            for ( let service_index in servicesInfo[host]) {
                servicesDetails.push(
                    <MuiAccordionDetails key={host + service_index}>
                        <StringTypography status={servicesInfo[host][service_index].status}>
                            {service_index} [{servicesInfo[host][service_index].last_check}]:<br></br>
                            {servicesInfo[host][service_index].plugin_output} 
                        </StringTypography>
                    </MuiAccordionDetails>
                )
            }
            servicesMain.push(
                <MuiAccordion key={host} expanded={expanded === 'panel' + count} onChange={handleChange('panel' + count)}>
                <MuiAccordionSummary key={host} aria-controls={`panel${count}bh-content`} id={`panel${count}bh-header`}>
                <MainTypography key={host}>{host}</MainTypography>
                    <MuiTypography>
                        {
                            (servicesInfo[host]["System: PING"].status == 2)?
                            "ENABLE":"DISABLE"
                        }
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
                    {servicesDetails}
                </MuiAccordion>
            );

            count++;
        }
        
          return (
            <div>
                {servicesMain}
            </div>
          );
        }
        
        ReactDOM.render(
            <StyledEngineProvider injectFirst>
                <CustomizedAccordions />
            </StyledEngineProvider>, 
            document.querySelector('#app')
        );
    }
}