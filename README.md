common:

'cldr-data/supplemental/likelySubtags.json',
'cldr-data/supplemental/numberingSystems.json',
'cldr-data/supplemental/timeData.json',
'cldr-data/supplemental/weekData.json'

locale specific:

'cldr-data/main/' + locale + '/numbers.json
'cldr-data/main/' + locale + '/ca-gregorian.json'
'cldr-data/main/' + locale + '/timeZoneNames.json'

plurals, units, relative time optional


bundle loader and cldr-data is only needed for example


prebuild:

messages -> string
dateFormatter -> options json
dateParser -> options json
numberFormatter -> options json
numberParser -> options json
currencyFormatter -> currency string, options json
pluralGenerator -> options json
relativeTimeFormatter -> unit string, options json
unitFormatter -> unit string, options json
