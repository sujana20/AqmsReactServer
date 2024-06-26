﻿define(
   ({
        _widgetLabel: "خريطة النظرة العامة",
        PreDefinedCharts: "أشكال بيانية محددة مسبقاً",
        InteractiveCharts: "التحليلات التفاعلية",
        DetailedAnalysis: "تحليل تفصيلي",
        SelectPollutant: "اختر الملوث",
        PollutantsLabel: "الملوث",
        CO: "أول أكسيد الكربون",
        NO2: "ثاني أكسيد النيتروجين",
        SO2: "ثاني أكسيد الكبريت",
        O3: "الأوزون",
        PM10: "الجزيئات الدقيقة العالقة في الهواء(10)",
        GenerateChart: "أنشئ شكلاً بيانياً",
        Download: "تحميل",
        DownloadPdf: "تحميل PDF",
        DownloadJpg: "تحميل PNG",
        DownloadData: "تحميل بيانات",
        CriteriaPollutants: "الملوثات المرجعية",
        NonCriteriaPollutants: "ملوثات أخرى",
        H2S: "كبريتيد الهيدروجين",
        PM25: "الهواء 2.5 ميكرون",
        Toluene: "تولين",
        O_Xylene: " أورثو- زيلين",
        EthylBenzene: " إثيل بنزين",
        mp_xylene: "ميتا بارا _ زيلين الميثان",
        CH4: "الميثان",
        Benzene: "بنزين",
        NMHC: "هيدروكربون غير ميثان",
        m_Xylene: "ميتا _ زيلين",
        p_Xylene: " بارا _ زيلين",
        MetParameters: "تتوافق مع المؤشرات",
        LowerAmbientTemperature: "درجة الحرارة المحيطة المنخفضة",
        UpperAmbientTemperature: "درجة الحرارة المحيطة المرتفعة",
        BarometricPressure: "الضغط الجوي",
        NetRadiation: " الإشعاع الصافي",
        RelativeHumidity: "الرطوبة النسبية",
        WindDirection: " اتجاه الرياح",
        WindSpeed: "سرعة الرياح",
        Precipitation: "الهطول",
        Noise: "ضوضاء",
        Filters: "تصنيف",
        Region: "منطقة",
        All: "الكل",
        StationName: "اسم المحطة",
        TimeFrame: "فترة زمنية",
        TypeofChart: "نوع المخطط",
        //BarChart: "شريط الرسم البياني",
        //LineChart: "الرسم البياني الخطي",
        //AreaChart: "الرسم البياني المساحي",
        //ScatterChart: "رسم بياني للانتشار",
        Criteria: "المعايير",
        //Mean: "الوسط",
        //Raw: "الخام",
        //Maximum: "أقصى",
        //CompliancePercentage: "نسبة الامتثال",
        //Concentrationsinlimitvalues: "التركيزات في قيم الحد٪",
       // ExceedencesNumbers: "ارقام التجاوزات",
        //Percnetile: " 50و98 بالمائة",
        DataFilters: "عنوان مرشحات البيانات",
        //OneHrData: "1 Hr Data",
        //TwentyfourHrData: "24 Hr Data",
        OneHOurData: "بيانات كل ساعة",
        TwentyfourHourData: "بيانات كل 24 ساعة",
        Thresholdlimit: "الحد المسموح",
        Category: "الفئة",
        Annualtendency_Label: " اتجاه الرسم البياني السنوي",
        Maxconcentrations: " التركيزات في قيم الحد٪ ",
        Meanvalues: " معنى القيم ",
        Rawchart: " مخطط البيانات الخام ",
        Maximumvalues: " الحد الأقصى للقيم ",
        Concentrations: " تركيزات (ميكروغرام / م 3) ",
        hourly: " كل ساعة ",
        ComplianceCharts: " المخطط النسبي للإمتثال ",
        DiurnalCharts_title: " الإختلافات اليومية ",
        AQL_Exceedchart_title: " ٪ من تجاوز قيمة AQL ",
        Windspeedchart_title: " سرعة الرياح خلال ",
        Winddirection_title: " اتجاه الرياح خلال ",
        HoursExceeding_title: " - ساعات التجاوز ",
        HourlyConcentration_title: " تركيزات الساعة (ميكروغرام / م 3) ",
        AnnualConcentration_title: " متوسط المعدل السنوي (ميكروغرام / م 3) ",
        Unabletogetdomain: "لا يمكن الحصول على بيانات النطاق",
        failedtogetSVG: "لا يمكن الحصول على SVG",
        clientsideError: "Failed to export on client side",
        UnabletoGenerateCharts: "لا يمكن انشاء مخطط",
        Timerange: "من فضلك، اختر أقل من 3 شهور",
        MorePollutantsSelected: "تم اختيار أكثر من 5  من الملوثات الأخرى",
        Select1Pollutant: "يرجى اختيار  ملوث واحد على الأقل لإنشاء شكل بياني",
        PM10_AQIExceed_title: " لا يمكن إنشاء مخطط لبيانات الجزيئات الدقيقة العالقة في الهواء (10) خلال الساعة بسبب عدم وجود قيمة حد لمؤشر جودة الهواء. ",
        CO_Exceed_title: " لا يمكن إنشاء مخطط لبيانات أول أكسيد الكربون والأوزون خلال 24 ساعة بسبب عدم وجود قيمة حد لمؤشر جودة الهواء. ",
        SO2_AQIExceed_title: " chart cannot be generated for SO<sub>2</sub>, NO<sub>2</sub> and PM<sub>10</sub> 8hr data as there is no AQI limit value. ",
        SelectoneStation: "الرجاء تحديد محطة واحدة فقط في كل مرة لإنشاء مخطط أولي",
        SelectSinglepollutant: "يرجى تحديد مالوث واحد في كل مرة لإنشاء مخطط أولي.",
        EightHrsGeneration_error: " لا يمكن إنشاء مخطط لبيانات 8 ساعات لملوثات  ثاني أكسيد الكبريت و ثاني أكسيد النيتروجين و الجزيئات الدقيقة العالقة في الهواء(10)",
        DiurnalCharts_error: "يمكن إنشاء المخططات النهارية فقط للملوثات أول أكسيد الكربون والأوزون",
        annualTendency_error: "غير قادر على إنشاء مخطط اتجاه الرسم البياني السنوي ",
        values: "قيم",
        Predefinedvalues: "قيم(µg/m<sup>3</sup>)",
        date: "تواريخ",
        Maximumvalues: "القيم القصوى",
        percentages: "النسب المئوية (٪)",
        OnehourConcentration: "التركيز الأقصى 1 ساعة",
        twentyfourConcentration: "أقصى تركيز 24 ساعة",
        frequency: "تكرر(٪)",
        windspeed: "سرعة الرياح",
        years: "السنة",
        StationName_title: "اسم المحطة",
        SelectSingleStation: "الرجاء اختيار على الأقل محطة واحدة",
        MaximumOneHourConcentration:' أقصى تركيز لمدة ساعة (ميكروغرام / م³)',
        SelectNonCriteriaPollutant: "الرجاء تحديد ملوث واحد على الأقل غير قياسي لإنشاء مخطط",
        SelectMetParameter: "يُرجى تحديد معلمة أرصاد جوية واحدة على الأقل لإنشاء مخطط",
        SelectNoise: "رجى تحديد الضوضاء لإنشاء الرسم البياني",
        SelectonlyWinddirection: "الرجاء تحديد اتجاه الرياح فقط ",
        SelectonlyWindspeed: "الرجاء تحديد سرعة الرياح فقط",
        Captionforoneyear: "* سيظهر حد مؤشر جودة الهواء لبيانات عام واحد فقط",
        CaptionforPM10: "* بالنسبة للبيانات PM10 - 1hr لا يوجد حد مؤشر جودة الهواء",
        CaptionforCOandO3: "* بالنسبة لبيانات CO و O3- 24hr ، لا يوجد حد لمؤشر جودة الهواء ",
        correlation: "Correlation",
        correlation_error: "يُرجى تحديد معلمة أرصاد جوية واحدة فقط لإنشاء مخطط ",
        genealAQIMessage: "لا ينطبق مؤشر جودة الهواء على المرشحات / الملوثات المحددة",
        MeanTimeseriesvalues: "معنى القيم في الأوقات",
        yearssAndDays: "سنة، شهر، يوم"
  })
);