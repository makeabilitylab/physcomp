---
layout: default
title: L1&#58; Heuristic-Based Classification
parent: Classification
has_toc: false # (on by default)
comments: false
---

# {{ page.title | replace_first:'L','Lesson '}}
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

## Using Google Colab

**Importantly,** to get the Step Tracker Exercise notebook to work in Colab, you must create a folder called `Logs` and copy over at least one log file from [here](https://github.com/makeabilitylab/signals/tree/master/Projects/StepTracker/Logs). I suggest starting with [`arduino_accel_righthoodiepocket_3sets_15steps_delay10_9600baud_subset.csv`](https://github.com/makeabilitylab/signals/blob/master/Projects/StepTracker/Logs/arduino_accel_righthoodiepocket_3sets_15steps_delay10_9600baud_subset.csv) because it's the most straightforward. 

To upload data to Colab, click on the folder icon on the left sidebar, then make a new folder called `Logs`, and then right-click on that folder and select `Upload`. Finally, select the file that you want to upload:

![Screenshot of uploading data to Google Colab](assets/images/GoogleColab_UploadingData_Screenshot.png)

Once you've done this, you can save the project to your Google Drive and then invite your breakout group to collaborate and code together in the Colab notebook.

![Screenshot of sharing and collaborating in Google Colab](assets/images/GoogleColab_ShareAndCollaborate_Screenshot.png)