**SkyRis** is an AI-powered IoT framework for short-range cloudburst prediction and early warning, designed particularly for vulnerable mountainous and urban regions.

Cloudbursts are highly localized and can develop rapidly, making them difficult to detect using conventional weather-monitoring systems with widely spaced observation stations. SkyRis addresses this limitation by combining **dense, low-cost environmental sensing with real-time sky image analysis**.

The system combines IoT sensors, machine learning, deep learning, and long-range LoRa communication into a single early-warning framework.

![AI Model Workflow](/papers/skyris/model-workflow.png)

## The Problem

Conventional weather-monitoring infrastructure is effective for observing large-scale atmospheric patterns, but highly localized cloudbursts can occur between monitoring stations and develop faster than conventional forecasting systems can respond.

SkyRis explores whether a network of inexpensive, closely deployed sensors can capture these localized atmospheric changes while sky imagery provides an additional view of developing cloud formations.

The objective is to provide **location-specific warnings with at least one hour of lead time**, while keeping the system practical for deployment in remote and connectivity-constrained regions.

## System Architecture

The framework combines environmental sensors, sky imaging, machine learning, and deep learning into a unified prediction pipeline.

The sensing layer monitors parameters such as **temperature, humidity, atmospheric pressure, rainfall, and other environmental signals**, while an ESP32 camera captures sky images.

Sensor data and image predictions are processed through separate model pipelines before being combined through ensemble voting.

## AI Pipeline

The sensor-based prediction pipeline uses an ensemble of:

- **Random Forest**
- **XGBoost**
- **Support Vector Classifier (SVC)**

Sensor readings are processed using **15-minute sliding windows**, with predictions generated continuously and aggregated through a hierarchical majority-voting process.

For the vision component, SkyRis uses two approaches:

- **DenseNet-121 with transfer learning**
![DenseNet Architecture](/papers/skyris/densenet-arch.png)

- **A lightweight custom CNN**
![CNN Architecture](/papers/skyris/cnn-arch.png)

The vision models classify sky images according to whether they indicate cloudburst-prone conditions.


When sky imagery is available, the system combines the sensor and vision predictions into a larger ensemble. If imagery is unavailable, the framework can fall back to the sensor-based models.

## IoT and Communication

A key design consideration is deployment in regions where conventional network connectivity may be unreliable.

SkyRis uses **LoRa-based communication** to transmit sensor readings over long distances with low power consumption.

The system can buffer readings locally when an internet connection is unavailable and upload them once connectivity is restored. This makes the architecture suitable for remote and high-altitude environments where Wi-Fi or cellular connectivity may not be dependable.

## Results

The experimental results demonstrate the potential of combining sensor and vision-based approaches.

### Sensor-Based Models

| Model | Accuracy | Precision | Recall | F1-Score |
| --- | ---: | ---: | ---: | ---: |
| Random Forest | 83% | 0.87 | 0.81 | 0.84 |
| XGBoost | **84%** | 0.87 | 0.81 | 0.84 |
| SVC | 83% | 0.86 | 0.80 | 0.83 |

### Vision Models

| Model | Accuracy | Precision | Recall | F1-Score |
| --- | ---: | ---: | ---: | ---: |
| Custom CNN | 93% | 0.97 | 0.91 | 0.94 |
| DenseNet-121 | 93% | 0.97 | 0.91 | 0.94 |

The sensor-based models achieved accuracy above 80%, with XGBoost performing best at approximately **84% accuracy**.

The vision models achieved approximately **93% accuracy and 0.94 F1-score**, showing that sky imagery can provide a useful complementary signal to environmental sensing.

## Early Warning

One of the key observations from the evaluation was the potential improvement in warning time.

Compared with conventional forecasting references used in the study, SkyRis was able to provide alerts approximately **one hour in advance** in the evaluated setup.

The combination of localized sensing and visual cloud analysis is particularly useful because the two modalities capture different aspects of the developing event.

## Discussion

The results suggest that cloudburst prediction can benefit from combining **localized environmental measurements with visual information about cloud development**.

The sensor network provides continuous numerical observations, while the vision pipeline adds information about cloud structures that cannot be directly captured by environmental sensors.

LoRa communication further extends the practical deployment potential by allowing the sensing infrastructure to continue operating in areas with limited connectivity.

However, the effectiveness of the system depends on factors such as **sensor density, sensor reliability, data availability, and deployment conditions**. These remain important considerations for moving the framework toward larger-scale real-world deployment.

## Conclusion

SkyRis presents a low-cost, AI-enabled IoT framework for localized cloudburst prediction and early warning.

By combining **environmental sensors, machine learning, sky-image analysis, and LoRa communication**, the system explores an alternative to relying exclusively on large-scale weather-monitoring infrastructure.

The results demonstrate sensor-model accuracy of up to **84%** and vision-model accuracy of approximately **93%**, while the evaluated system showed the potential to provide warnings around **one hour in advance**.
