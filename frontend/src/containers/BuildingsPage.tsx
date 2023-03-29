import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import BuildingListButtonComponent from '@/components/elements/ListViewElement/ListButtonElements/BuildingListButtonComponent';
import BuildingTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/BuildingTopBarComponent';
import React from 'react';

interface Building {
    id: number
    naam: string,
    adres: string,
    regio: string
}

const dummyBuildings:Building[] = [
    {id: 7, naam: 'Bavo', adres: 'Radijsweg 93', regio: 'Gent'},
    {id: 1, naam: 'Lander', adres: 'Pompoenstraat 6', regio: 'Antwerpen'},
    {id: 2, naam: 'Jef', adres: 'Paprikalaan 7', regio: 'Gent'},
    {id: 3, naam: 'Maxim', adres: 'Komkommerlaan 69', regio: 'Gent'},
    {id: 4, naam: 'Pim', adres: 'Wortelsesteenweg 42', regio: 'Antwerpen'},
    {id: 5, naam: 'Joris', adres: 'Tomaatstraat 21', regio: 'Gent'},
    {id: 6, naam: 'Jahid', adres: 'Bonenwegel 69', regio: 'Gent'},
    {id: 0, naam: 'building 2', adres: 'Courgettelaan 42', regio: 'Antwerpen'},
    {id: 8, naam: 'building 3', adres: 'Slastraat 21', regio: 'Gent'},
    {id: 9, naam: 'building 1', adres: 'Spinaziewegel 69', regio: 'Gent'},
    {id: 10, naam: 'Upkot SintPieters', adres: 'Bloemkoolsesteenweg 42', regio: 'Antwerpen'},
    {id: 11, naam: 'Jail', adres: 'Ajuinwegel 21', regio: 'Gent'},
];

const dummySindici = [
    {name: 'Jan Tomas'},
    {name: 'Peter Selie'},
    {name: 'Wily Willson'},
];

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];


export default function BuildingsPage() {

    return (
        <>
            <ListViewComponent listData={dummyBuildings} regionData={dummyRegions}
                ListItem={BuildingListButtonComponent} TopBar={BuildingTopBarComponent}>
                <h1>CONTENT</h1>
            </ListViewComponent>
        </>
    );
}
