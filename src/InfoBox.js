import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core";
import "./InfoBox.css";
function InfoBox({title, cases, red, active, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infobox--selected'} ${red && 'infobox--red'}`} >
            <CardContent>

                    {/* Title - Coronavirus C   ases */}

                    <Typography className='infoBox__title' color='textSecondary'>
                        {title}
                    </Typography>

                    {/* "New Cases +120k N" */}
                    <h2 className={`infoBox__cases ${!red && 'infoBox__cases--green'}`}>{cases}</h2>

                    {/* "total 1.2m cases" */}

                    <Typography className='infoBox__total' color='textSecondary'>
                        {total + ' total'}
                    </Typography>

            </CardContent>



        </Card>
    )
}

export default InfoBox;

