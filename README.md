# 🚀 **Live Project Link → [plant-disease-prediction-lastest-ma.vercel.app](https://plant-disease-prediction-lastest-ma.vercel.app/)**

# 🌿 AgroVision — Data-Driven Crop Disease Detection & Smart Analysis

> **Innovate Bharat Hackathon 2026** · Track: Data Science & Smart Analysis (DSSA) · Team: GreenVision · ID: DSSA111

[![Accuracy](https://img.shields.io/badge/Validation%20Accuracy-95.8%25-brightgreen)](.)
[![Dataset](https://img.shields.io/badge/Dataset-87%2C000%2B%20Images-blue)](.)
[![Classes](https://img.shields.io/badge/Disease%20Classes-38-orange)](.)
[![Framework](https://img.shields.io/badge/Framework-PyTorch-red)](.)
[![Model](https://img.shields.io/badge/Model-EfficientNet--B4-purple)](.)

---

## 📌 Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Model Architecture](#model-architecture)
5. [Technology Stack](#technology-stack)
6. [Dataset](#dataset)
7. [Features](#features)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Results](#results)
10. [Team](#team)

---

## Overview

AgroVision is an AI-powered plant disease detection system that identifies crop diseases from leaf images with high speed and accuracy. Built on a deep convolutional neural network trained on over 87,000 images across 38 disease classes, AgroVision enables farmers to receive a reliable diagnosis in real time — replacing slow, expert-dependent manual inspection with an automated, scalable, and field-ready solution.

The system is designed not only as a technical proof of concept, but as a socially meaningful tool aimed at reducing crop loss, empowering farmers in rural and resource-limited areas, and supporting India's food security goals.

---

## Problem Statement

Crop diseases cause significant agricultural losses annually, yet effective diagnosis remains out of reach for most smallholder farmers. Manual inspection is slow, error-prone, and requires domain expertise that is simply unavailable in the majority of farming communities across rural India. The consequences — delayed treatment, preventable yield loss, and financial distress — compound at scale.

**The core challenges this project addresses:**

- No affordable tool exists to detect plant diseases in real time at the field level.
- Disease identification spans 38 crop categories (Apple Scab, Corn Rust, Potato Blight, Tomato Mosaic Virus, and more), making manual expertise impractical.
- Farmers in rural areas lack access to trained agronomists or reliable diagnostic services.
- Late detection leads directly to crop loss, income reduction, and food insecurity.

---

## Solution

AgroVision accepts a leaf image as input and automatically classifies it into one of 38 disease categories (including healthy) with approximately **95.8% validation accuracy**. The pipeline is fully automated — from image capture through preprocessing to classification and recommendation output — requiring no manual intervention and no agricultural expertise from the end user.

```
Input Image → Resize (380×380) → Normalize → EfficientNet-B4 → Softmax → Disease Class + Confidence
```

---

## Model Architecture

The model uses **EfficientNet-B4** as its backbone, selected for its optimal balance of accuracy and computational efficiency. A custom classification head is appended, consisting of:

- **Batch Normalization** — stabilizes training and accelerates convergence
- **Linear Layer** — maps extracted features to 38 output classes
- **ReLU Activation** — introduces non-linearity
- **Dropout** — reduces overfitting during training

Transfer learning is applied to leverage pretrained ImageNet weights, enabling faster convergence and improved generalization on the plant disease dataset.

### Training Strategy

Training follows a two-stage pipeline:

**Stage 1 — Plant vs. Non-Plant:** A binary classifier is trained first to filter non-plant inputs, using a warmup phase followed by fine-tuning.

**Stage 2 — Disease Classification:** The full 38-class classifier is trained on the filtered dataset, again with warmup and fine-tuning on the EfficientNet-B4 backbone.

| Parameter | Value |
|---|---|
| Optimizer | Adam / AdamW |
| Loss Function | CrossEntropy with Label Smoothing |
| Input Resolution | 380 × 380 px |
| Train / Val Split | 80% / 20% |
| Training Accuracy | ~94–96% |
| Validation Accuracy | ~95.8% |

---

## Technology Stack

| Library / Framework | Purpose |
|---|---|
| **Python** | Core programming language; data handling, logging, reproducibility |
| **PyTorch + Torchvision** | Deep learning framework; model construction, training, optimization |
| **EfficientNet-B4** | CNN backbone with transfer learning |
| **PIL (Pillow)** | Image loading and preprocessing |
| **Matplotlib + tqdm** | Performance visualization and training progress tracking |
| **Scikit-learn** | Dataset splitting; evaluation metrics (accuracy, precision, recall, F1) |

---

## Dataset

The model is trained on a curated dataset of **87,000+ high-quality labeled leaf images** covering **38 distinct plant disease classes**, including healthy plant samples.

- **Resolution:** All images standardized to 380 × 380 pixels.
- **Normalization:** Pixel values scaled from 0–255 to 0–1 for improved training stability.
- **Augmentation (training only):** Random crop, horizontal flip, rotation, and color jitter to simulate real-world field conditions.
- **Augmentation (validation):** Resize only — no augmentation applied to ensure fair evaluation.

**Disease categories include (not exhaustive):** Apple Scab, Apple Black Rot, Apple Cedar Rust, Corn Gray Leaf Spot, Corn Rust, Potato Early Blight, Potato Late Blight, Tomato Mosaic Virus, Tomato Leaf Mold, and 29 additional classes.

---

## Features

**Core capabilities of the AgroVision system:**

- Classifies leaf images into 38 disease categories, including healthy plant detection.
- Achieves ~95.8% validation accuracy on a large and diverse dataset.
- Provides full Softmax probability scores across all classes for interpretability.
- Delivers real-time predictions suitable for field use.
- Outputs evaluation metrics including Precision, Recall, F1-Score, and Confusion Matrix.
- Fully automated pipeline requiring no expert intervention.
- Scalable architecture — new disease classes can be added through retraining without redesigning the model.
- Lightweight architecture compatible with future mobile deployment (MobileNet-ready).

---

## Implementation Roadmap

```
Phase 1 ─ Data Collection & Preprocessing
          Collect 87K+ images · Resize · Normalize · Augment

Phase 2 ─ Model Development
          EfficientNet-B4 backbone · Custom classification head · PyTorch

Phase 3 ─ Two-Stage Training
          Plant vs. Non-Plant → 38-class disease classification

Phase 4 ─ Optimization
          Adam/AdamW · Label Smoothing · Dropout · Early Stopping

Phase 5 ─ Evaluation
          Accuracy · Precision · Recall · F1-Score · Confusion Matrix

Phase 6 ─ Deployment & Scaling
          Mobile/web integration · Retraining pipeline for new classes
```

---

## Results

| Metric | Value |
|---|---|
| Training Accuracy | ~94–96% |
| Validation Accuracy | **~95.8%** |
| Number of Classes | 38 |
| Dataset Size | 87,000+ images |
| Input Resolution | 380 × 380 px |

The model demonstrates strong generalization, maintaining consistent accuracy between training and validation sets — indicating minimal overfitting despite the complexity of the 38-class problem.

---

## Team

**Team Name:** GreenVision  
**Team ID:** DSSA111  
**Institution:** Sharda University  
**Hackathon:** Innovate Bharat Hackathon 2026  
**Track:** Data Science & Smart Analysis (DSSA)

| # | Name | Role |
|---|---|---|
| 1 | Arman Khan | Team Leader |
| 2 | Mohammad Umar Farooq | Member |
| 3 | Jamiz Qamar | Member |
| 4 | Kashif Farooqui | Member |
| 5 | Anubhav Bharadwaj | Member |
| 6 | Arshad Husain | Member |

---

> *"Helping Farmers Grow Smarter, Healthier Crops"*  
> AgroVision · GreenVision · Innovate Bharat Hackathon 2026
